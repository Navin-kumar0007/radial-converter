package io.github.navinkumar0007.shiftdrop

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.ClipData
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.ColorSpace
import android.graphics.ImageDecoder
import android.media.MediaExtractor
import android.media.MediaFormat
import android.media.MediaMetadataRetriever
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.DocumentsContract
import android.util.Log
import android.view.WindowManager
import androidx.core.content.FileProvider
import androidx.media3.common.Effect
import androidx.media3.common.MediaItem
import androidx.media3.common.MimeTypes
import androidx.media3.common.util.UnstableApi
import androidx.media3.effect.Presentation
import androidx.media3.effect.ScaleAndRotateTransformation
import androidx.media3.transformer.AudioEncoderSettings
import androidx.media3.transformer.Composition
import androidx.media3.transformer.DefaultEncoderFactory
import androidx.media3.transformer.EditedMediaItem
import androidx.media3.transformer.Effects
import androidx.media3.transformer.ExportException
import androidx.media3.transformer.ExportResult
import androidx.media3.transformer.InAppMp4Muxer
import androidx.media3.transformer.ProgressHolder
import androidx.media3.transformer.Transformer
import androidx.media3.transformer.VideoEncoderSettings
import io.flutter.plugin.common.BinaryMessenger
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.IOException
import java.nio.ByteBuffer
import java.util.zip.Deflater
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream
import kotlin.concurrent.thread
import kotlin.math.max
import me.zhanghai.android.libarchive.Archive
import me.zhanghai.android.libarchive.ArchiveEntry
import me.zhanghai.android.libarchive.ArchiveException

private const val SAVE_REQUEST = 7301
private const val PROGRESS_EVERY_MS = 500L
private const val FRAME_SIDE = 480
private const val UNPACK_BUFFER = 1L shl 20
private const val UNPACK_MOST_FILES = 100000

/**
 * A failure for the app. [key] and [args] name the message in core/lib/src/failures.dart, so the app
 * can show it in its own language; [english] is used if it can't.
 */
private class Said(val key: String, val english: String, val args: Map<String, String> = emptyMap())

private fun MethodChannel.Result.fail(said: Said, details: String? = null) =
    error("failed", said.english, mapOf("key" to said.key, "args" to said.args, "details" to details))

/**
 * Carries out the plans in `core/lib/src/media_plan.dart` with Media3 Transformer, which uses the
 * phone's own encoders. Results wait in the app's cache until the user saves them. Originals are
 * only read.
 */
@androidx.annotation.OptIn(UnstableApi::class)
class MediaEngine(private val activity: Activity, messenger: BinaryMessenger) :
    MethodChannel.MethodCallHandler {

    private class Running(
        val transformer: Transformer,
        val result: MethodChannel.Result,
        val folder: File,
        val reportProgress: Runnable,
    )

    private class PendingSave(val source: File, val result: MethodChannel.Result)

    private val channel = MethodChannel(messenger, "radial/media")
    private val main = Handler(Looper.getMainLooper())
    private val outputs = File(activity.cacheDir, "radial_output")
    private val running = HashMap<Int, Running>()
    private var pendingSave: PendingSave? = null

    init {
        channel.setMethodCallHandler(this)
        // Nothing can be in use yet, and videos are too big to leave behind. The picker copies each
        // chosen file into its own folder, so those go too.
        thread {
            outputs.deleteRecursively()
            File(activity.cacheDir, "file_picker").deleteRecursively()
        }
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        when (call.method) {
            "probe" -> probe(call.argument<String>("path")!!, result)
            "convert" -> convert(call, result)
            "cancel" -> {
                cancel(call.argument<Int>("id")!!)
                result.success(null)
            }
            "decodePhoto" -> decodePhoto(call.argument<String>("path")!!, result)
            "handOverFolder" -> result.success(
                File(outputs, "share-${System.nanoTime()}").apply { mkdirs() }.path,
            )
            "shareFile" -> shareFile(call, result)
            "unpackArchive" -> unpackArchive(
                call.argument<String>("path")!!,
                (call.argument<Number>("limit")!!).toLong(),
                result,
            )
            "videoFrame" -> videoFrame(
                call.argument<String>("path")!!,
                call.argument<Double>("seconds")!!,
                result,
            )
            "save" -> save(call, result)
            "keepWorking" -> {
                if (call.argument<Boolean>("working") == true) {
                    KeepWorkingService.start(
                        activity,
                        call.argument<String>("title") ?: "ShiftDrop",
                        call.argument<String>("text") ?: "",
                    )
                } else {
                    KeepWorkingService.stop(activity)
                }
                result.success(null)
            }
            "isKeepingWorking" -> result.success(KeepWorkingService.isRunning(activity))
            else -> result.notImplemented()
        }
    }

    fun stop() {
        channel.setMethodCallHandler(null)
        running.keys.toList().forEach(::cancel)
        KeepWorkingService.stop(activity)
    }

    /** Writes a HEIC photo out as a PNG, upright, for the picture engine to read. */
    private fun decodePhoto(path: String, result: MethodChannel.Result) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.P) {
            result.fail(Said("heicNeedsAndroid9", "HEIC photos need Android 9 or newer."))
            return
        }
        thread {
            val png = try {
                val bitmap = ImageDecoder.decodeBitmap(ImageDecoder.createSource(File(path))) { decoder, _, _ ->
                    decoder.allocator = ImageDecoder.ALLOCATOR_SOFTWARE
                    decoder.setTargetColorSpace(ColorSpace.get(ColorSpace.Named.SRGB))
                }
                val folder = File(outputs, "photo-${System.nanoTime()}").apply { mkdirs() }
                val file = File(folder, "photo.png")
                file.outputStream().use { bitmap.compress(Bitmap.CompressFormat.PNG, 100, it) }
                bitmap.recycle()
                file.path
            } catch (error: IOException) {
                Log.w(TAG, "Could not read a photo", error)
                null
            } catch (error: OutOfMemoryError) {
                Log.w(TAG, "A photo was too large", error)
                null
            }
            main.post {
                if (png == null) {
                    result.fail(Said("photoDamaged", "This photo could not be read. It may be damaged."))
                } else {
                    result.success(mapOf("path" to png))
                }
            }
        }
    }

    /** Opens the share sheet. With `dryRun` it only says what other apps would be given. */
    private fun shareFile(call: MethodCall, result: MethodChannel.Result) {
        val file = File(call.argument<String>("path")!!)
        if (!file.exists()) {
            result.fail(Said("goneBeforeSharing", "${file.name} is no longer here to share.", mapOf("name" to file.name)))
            return
        }
        val uri = try {
            FileProvider.getUriForFile(activity, "${activity.packageName}.results", file)
        } catch (error: IllegalArgumentException) {
            Log.w(TAG, "Could not share a file", error)
            result.fail(Said("cantShare", "${file.name} could not be shared.", mapOf("name" to file.name)))
            return
        }
        if (call.argument<Boolean>("dryRun") == true) {
            result.success(uri.toString())
            return
        }
        val send = Intent(Intent.ACTION_SEND).apply {
            type = call.argument<String>("mime")
            putExtra(Intent.EXTRA_STREAM, uri)
            clipData = ClipData.newRawUri(file.name, uri)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        try {
            activity.startActivity(Intent.createChooser(send, null))
            result.success(uri.toString())
        } catch (error: ActivityNotFoundException) {
            Log.w(TAG, "Nothing can take a shared file", error)
            result.fail(Said("noAppTakesIt", "No app here can take this file."))
        }
    }

    private class UnpackFailed(val said: Said) : Exception(said.english)

    /**
     * Unpacks a 7z or RAR into a ZIP in the cache, for the archive engine to take from there. Only
     * regular files come out, so links can't point anywhere, and [limit] counts what really comes
     * out, so a zip bomb stops here.
     */
    private fun unpackArchive(path: String, limit: Long, result: MethodChannel.Result) {
        thread {
            val name = File(path).name
            val zip = File(File(outputs, "archive-${System.nanoTime()}").apply { mkdirs() }, "unpacked.zip")
            var failure: Said? = null
            try {
                writeUnpacked(path, name, zip, limit)
            } catch (error: UnpackFailed) {
                failure = error.said
            } catch (error: ArchiveException) {
                Log.w(TAG, "Could not read an archive", error)
                failure = describeFailure(name, error.message)
            } catch (error: IOException) {
                Log.w(TAG, "Could not unpack an archive", error)
                failure = Said("cantRead", "$name could not be read.", mapOf("name" to name))
            }
            if (failure != null) zip.parentFile?.deleteRecursively()
            main.post {
                if (failure != null) {
                    result.fail(failure)
                } else {
                    result.success(mapOf("path" to zip.path))
                }
            }
        }
    }

    private fun lockedMessage(name: String) =
        Said("lockedArchive", "$name has a password. Locked 7z and RAR files can't be opened yet.", mapOf("name" to name))

    private fun describeFailure(name: String, reason: String?): Said {
        val lower = reason.orEmpty().lowercase()
        if (lower.contains("encrypt") || lower.contains("passphrase") || lower.contains("password")) {
            return lockedMessage(name)
        }
        return Said(
            "damagedOrPart",
            "$name could not be read. It may be damaged, or one part of several.",
            mapOf("name" to name),
        )
    }

    private fun writeUnpacked(path: String, name: String, zip: File, limit: Long) {
        val archive = Archive.readNew()
        try {
            // Only the formats wanted, so nothing else in the library ever sees a stranger's file.
            Archive.readSupportFormat7zip(archive)
            Archive.readSupportFormatRar(archive)
            Archive.readSupportFormatRar5(archive)
            // Without this any name that isn't plain English stops the whole archive.
            Archive.setCharset(archive, "UTF-8".toByteArray())
            Archive.readOpenFileName(archive, path.toByteArray(), UNPACK_BUFFER)
            val buffer = ByteBuffer.allocateDirect(UNPACK_BUFFER.toInt())
            val bytes = ByteArray(UNPACK_BUFFER.toInt())
            val used = HashSet<String>()
            var total = 0L
            var files = 0
            ZipOutputStream(zip.outputStream().buffered()).use { out ->
                // Pictures and videos barely shrink, and this runs while the user waits.
                out.setLevel(Deflater.NO_COMPRESSION)
                while (true) {
                    val entry = Archive.readNextHeader(archive)
                    if (entry == 0L) break
                    if (ArchiveEntry.isEncrypted(entry)) throw UnpackFailed(lockedMessage(name))
                    if (ArchiveEntry.filetype(entry) != ArchiveEntry.AE_IFREG) continue
                    if (ArchiveEntry.hardlink(entry) != null) continue
                    if (++files > UNPACK_MOST_FILES) throw UnpackFailed(Said("tooManyInArchive", "$name holds too many files to open here.", mapOf("name" to name)))
                    // A name that can't be read mustn't lose the file.
                    val entryName = ArchiveEntry.pathnameUtf8(entry).takeUnless { it.isNullOrEmpty() }
                        ?: ArchiveEntry.pathname(entry)?.toString(Charsets.UTF_8).takeUnless { it.isNullOrEmpty() }
                        ?: "file $files"
                    // A ZIP writer refuses repeats, and a hostile archive may have them.
                    var unique = entryName
                    var copy = 1
                    while (!used.add(unique)) unique = "$entryName (${++copy})"
                    out.putNextEntry(ZipEntry(unique))
                    val declared = if (ArchiveEntry.sizeIsSet(entry)) ArchiveEntry.size(entry) else null
                    var written = 0L
                    while (true) {
                        buffer.clear()
                        Archive.readData(archive, buffer)
                        buffer.flip()
                        val count = buffer.remaining()
                        if (count == 0) break
                        total += count
                        if (total > limit) throw UnpackFailed(Said("tooLargeHere", "$name is too large to open here.", mapOf("name" to name)))
                        buffer.get(bytes, 0, count)
                        out.write(bytes, 0, count)
                        written += count
                    }
                    // This build treats a cut-off file as simply ending. A short file must not pass
                    // for a whole one.
                    if (declared != null && written != declared) {
                        throw UnpackFailed(describeFailure(name, null))
                    }
                    out.closeEntry()
                }
            }
            if (files == 0) throw UnpackFailed(Said("emptyArchive", "$name has no files in it.", mapOf("name" to name)))
        } finally {
            Archive.readFree(archive)
        }
    }

    /** One frame as a small JPEG, to show before trimming. Failing only means no picture there. */
    private fun videoFrame(path: String, seconds: Double, result: MethodChannel.Result) {
        thread {
            val jpeg = try {
                readFrame(path, (seconds * 1_000_000).toLong())
            } catch (error: RuntimeException) {
                Log.w(TAG, "Could not read a frame", error)
                null
            } catch (error: IOException) {
                Log.w(TAG, "Could not read a frame", error)
                null
            }
            main.post {
                if (jpeg == null) {
                    result.fail(Said("videoNoPicture", "This video has no picture to show here."))
                } else {
                    result.success(jpeg)
                }
            }
        }
    }

    private fun readFrame(path: String, micros: Long): ByteArray? {
        val retriever = MediaMetadataRetriever()
        try {
            retriever.setDataSource(path)
            val option = MediaMetadataRetriever.OPTION_CLOSEST
            val frame = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                retriever.getScaledFrameAtTime(micros, option, FRAME_SIDE, FRAME_SIDE)
            } else {
                retriever.getFrameAtTime(micros, option)
            } ?: return null
            val bytes = ByteArrayOutputStream()
            frame.compress(Bitmap.CompressFormat.JPEG, 80, bytes)
            frame.recycle()
            return bytes.toByteArray()
        } finally {
            retriever.release()
        }
    }

    private fun probe(path: String, result: MethodChannel.Result) {
        thread {
            val info = try {
                readInfo(path)
            } catch (error: Exception) {
                Log.w(TAG, "Could not read a file", error)
                null
            }
            main.post {
                if (info == null) {
                    result.fail(Said("fileDamaged", "This file could not be read. It may be damaged."))
                } else {
                    result.success(info)
                }
            }
        }
    }

    private fun readInfo(path: String): Map<String, Any?> {
        val info = HashMap<String, Any?>()
        var micros = 0L
        val extractor = MediaExtractor()
        try {
            extractor.setDataSource(path)
            for (index in 0 until extractor.trackCount) {
                val format = extractor.getTrackFormat(index)
                val mime = format.getString(MediaFormat.KEY_MIME) ?: continue
                if (format.containsKey(MediaFormat.KEY_DURATION)) {
                    micros = max(micros, format.getLong(MediaFormat.KEY_DURATION))
                }
                if (mime.startsWith("video/") && !info.containsKey("videoCodec")) {
                    val rotation = if (format.containsKey(MediaFormat.KEY_ROTATION)) {
                        format.getInteger(MediaFormat.KEY_ROTATION)
                    } else {
                        0
                    }
                    val width = format.getInteger(MediaFormat.KEY_WIDTH)
                    val height = format.getInteger(MediaFormat.KEY_HEIGHT)
                    val sideways = rotation == 90 || rotation == 270
                    info["width"] = if (sideways) height else width
                    info["height"] = if (sideways) width else height
                    info["videoCodec"] = VIDEO_NAMES[mime] ?: mime
                } else if (mime.startsWith("audio/") && !info.containsKey("audioCodec")) {
                    info["audioCodec"] = AUDIO_NAMES[mime] ?: mime
                }
            }
        } finally {
            extractor.release()
        }
        if (micros <= 0) micros = durationFromRetriever(path) * 1000
        info["seconds"] = micros / 1_000_000.0
        return info
    }

    /** Some formats keep their length only here. Milliseconds, or 0 if unknown. */
    private fun durationFromRetriever(path: String): Long {
        val retriever = MediaMetadataRetriever()
        return try {
            retriever.setDataSource(path)
            retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION)?.toLongOrNull() ?: 0
        } catch (_: RuntimeException) {
            0
        } finally {
            retriever.release()
        }
    }

    private fun convert(call: MethodCall, result: MethodChannel.Result) {
        val id = call.argument<Int>("id")!!
        val folder = File(outputs, id.toString())
        try {
            folder.mkdirs()
            val output = File(folder, File(call.argument<String>("name")!!).name)
            val transformer = buildTransformer(call, id, output, result, folder)
            val reportProgress = object : Runnable {
                override fun run() {
                    val holder = ProgressHolder()
                    if (transformer.getProgress(holder) == Transformer.PROGRESS_STATE_AVAILABLE) {
                        channel.invokeMethod(
                            "progress",
                            mapOf("id" to id, "value" to holder.progress / 100.0),
                        )
                    }
                    main.postDelayed(this, PROGRESS_EVERY_MS)
                }
            }
            running[id] = Running(transformer, result, folder, reportProgress)
            activity.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            transformer.start(editedItem(call), output.path)
            main.postDelayed(reportProgress, PROGRESS_EVERY_MS)
        } catch (error: RuntimeException) {
            Log.w(TAG, "Could not start", error)
            finish(id)
            folder.deleteRecursively()
            result.fail(Said("notConverted", "This file could not be converted."))
        }
    }

    private fun buildTransformer(
        call: MethodCall,
        id: Int,
        output: File,
        result: MethodChannel.Result,
        folder: File,
    ): Transformer {
        val copyVideo = call.argument<Boolean>("copyVideo") == true
        val copyAudio = call.argument<Boolean>("copyAudio") == true
        val encoders = DefaultEncoderFactory.Builder(activity)
        val builder = Transformer.Builder(activity)
        if (!copyVideo) {
            if (call.argument<String>("videoCodec") == "avc") {
                builder.setVideoMimeType(MimeTypes.VIDEO_H264)
            }
            call.argument<Int>("videoKbps")?.let { kbps ->
                encoders.setRequestedVideoEncoderSettings(
                    VideoEncoderSettings.Builder().setBitrate(kbps * 1000).build(),
                )
            }
        }
        if (!copyAudio) {
            if (call.argument<String>("audioCodec") == "aac") {
                builder.setAudioMimeType(MimeTypes.AUDIO_AAC)
            }
            call.argument<Int>("audioKbps")?.let { kbps ->
                encoders.setRequestedAudioEncoderSettings(
                    AudioEncoderSettings.Builder().setBitrate(kbps * 1000).build(),
                )
            }
        }
        return builder
            .setEncoderFactory(encoders.build())
            // Videos can hold where they were filmed. As on the other platforms, none of what a
            // file says about itself is kept. Which way up it plays is written separately.
            .setMuxerFactory(InAppMp4Muxer.Factory { entries -> entries.clear() })
            .addListener(object : Transformer.Listener {
                override fun onCompleted(composition: Composition, exportResult: ExportResult) {
                    if (finish(id) == null) return
                    result.success(mapOf("path" to output.path, "size" to output.length()))
                }

                override fun onError(
                    composition: Composition,
                    exportResult: ExportResult,
                    exportException: ExportException,
                ) {
                    if (finish(id) == null) return
                    Log.w(TAG, exportException.errorCodeName, exportException)
                    folder.deleteRecursively()
                    result.fail(plainMessage(exportException), exportException.errorCodeName)
                }
            })
            .build()
    }

    private fun editedItem(call: MethodCall): EditedMediaItem {
        val item = MediaItem.Builder().setUri(Uri.fromFile(File(call.argument<String>("input")!!)))
        val start = call.argument<Double>("startSeconds")
        val end = call.argument<Double>("endSeconds")
        if (start != null || end != null) {
            val clip = MediaItem.ClippingConfiguration.Builder()
            start?.let { clip.setStartPositionMs((it * 1000).toLong()) }
            end?.let { clip.setEndPositionMs((it * 1000).toLong()) }
            item.setClippingConfiguration(clip.build())
        }

        val video = ArrayList<Effect>()
        call.argument<Int>("degrees")?.let { clockwise ->
            // Media3 counts the other way round from plans.
            video.add(
                ScaleAndRotateTransformation.Builder()
                    .setRotationDegrees((360 - clockwise).toFloat())
                    .build(),
            )
        }
        val width = call.argument<Int>("width")
        val height = call.argument<Int>("height")
        if (width != null && height != null) {
            video.add(
                Presentation.createForWidthAndHeight(width, height, Presentation.LAYOUT_SCALE_TO_FIT),
            )
        }
        return EditedMediaItem.Builder(item.build())
            .setRemoveAudio(call.argument<Boolean>("dropAudio") == true)
            .setRemoveVideo(call.argument<Boolean>("dropVideo") == true)
            .setEffects(Effects(emptyList(), video))
            .build()
    }

    private fun plainMessage(error: ExportException): Said {
        return when (error.errorCode) {
            ExportException.ERROR_CODE_DECODING_FORMAT_UNSUPPORTED,
            ExportException.ERROR_CODE_DECODER_INIT_FAILED ->
                Said("phoneCantRead", "This phone can't read the video or sound in this file.")
            ExportException.ERROR_CODE_ENCODING_FORMAT_UNSUPPORTED,
            ExportException.ERROR_CODE_ENCODER_INIT_FAILED ->
                Said("phoneCantMake", "This phone can't make this kind of file at this size.")
            ExportException.ERROR_CODE_IO_FILE_NOT_FOUND,
            ExportException.ERROR_CODE_IO_NO_PERMISSION ->
                Said("fileMoved", "This file could not be read. It may have moved.")
            else -> Said("notConverted", "This file could not be converted.")
        }
    }

    /** Forgets a job, returning it, or null if it was already over. */
    private fun finish(id: Int): Running? {
        val job = running.remove(id) ?: return null
        main.removeCallbacks(job.reportProgress)
        if (running.isEmpty()) {
            activity.window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        }
        return job
    }

    /** Transformer says nothing after a cancel, so the reply is sent from here. */
    private fun cancel(id: Int) {
        val job = finish(id) ?: return
        job.transformer.cancel()
        job.folder.deleteRecursively()
        job.result.error("cancelled", null, null)
    }

    /** Lets the user choose where a result goes, then copies it there piece by piece. */
    private fun save(call: MethodCall, result: MethodChannel.Result) {
        if (pendingSave != null) {
            result.fail(Said("finishSavingFirst", "Finish saving the other file first."))
            return
        }
        val intent = Intent(Intent.ACTION_CREATE_DOCUMENT)
            .addCategory(Intent.CATEGORY_OPENABLE)
            .setType(call.argument<String>("mime")!!)
            .putExtra(Intent.EXTRA_TITLE, call.argument<String>("name")!!)
        pendingSave = PendingSave(File(call.argument<String>("path")!!), result)
        try {
            activity.startActivityForResult(intent, SAVE_REQUEST)
        } catch (_: ActivityNotFoundException) {
            pendingSave = null
            result.fail(Said("noSaveChooser", "This phone has no way to choose where to save."))
        }
    }

    /** True if this was the answer to [save]. */
    fun onSaveResult(requestCode: Int, resultCode: Int, data: Intent?): Boolean {
        if (requestCode != SAVE_REQUEST) return false
        val pending = pendingSave ?: return true
        pendingSave = null
        val target = data?.data
        if (resultCode != Activity.RESULT_OK || target == null) {
            pending.result.success(false)
            return true
        }
        thread {
            val saved = try {
                val out = activity.contentResolver.openOutputStream(target, "w")
                    ?: throw IOException("No stream")
                out.use { stream -> pending.source.inputStream().use { it.copyTo(stream) } }
                true
            } catch (error: Exception) {
                Log.w(TAG, "Could not save", error)
                try {
                    DocumentsContract.deleteDocument(activity.contentResolver, target)
                } catch (_: Exception) {
                    // A part-written file stays, and the user is told saving failed.
                }
                false
            }
            main.post {
                if (saved) {
                    pending.result.success(true)
                } else {
                    pending.result.fail(Said("notSaved", "This file could not be saved."))
                }
            }
        }
        return true
    }

    private companion object {
        const val TAG = "RadialMedia"

        /** The names plans use. */
        val VIDEO_NAMES = mapOf(
            MimeTypes.VIDEO_H264 to "avc",
            MimeTypes.VIDEO_H265 to "hevc",
            MimeTypes.VIDEO_VP8 to "vp8",
            MimeTypes.VIDEO_VP9 to "vp9",
            MimeTypes.VIDEO_AV1 to "av1",
        )
        val AUDIO_NAMES = mapOf(
            MimeTypes.AUDIO_AAC to "aac",
            MimeTypes.AUDIO_MPEG to "mp3",
            MimeTypes.AUDIO_OPUS to "opus",
            MimeTypes.AUDIO_FLAC to "flac",
            MimeTypes.AUDIO_VORBIS to "vorbis",
        )
    }
}
