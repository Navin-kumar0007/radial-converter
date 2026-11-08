package io.github.navinkumar0007.shiftdrop

import android.app.Activity
import android.content.ContentResolver
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.OpenableColumns
import android.util.Log
import io.flutter.plugin.common.BinaryMessenger
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import java.io.File
import java.util.concurrent.Executors

private const val TAG = "RadialShare"

/**
 * Takes files shared from other apps. A shared file is only lent to us, and the engines need a real
 * path, so each is copied into the app's cache, where it stays until the next launch. Originals are
 * only read.
 */
class ShareReceiver(private val activity: Activity, messenger: BinaryMessenger) :
    MethodChannel.MethodCallHandler {

    private val channel = MethodChannel(messenger, "radial/share")
    private val main = Handler(Looper.getMainLooper())
    private val folder = File(activity.cacheDir, "radial_shared")

    /** In order, so clearing out the last launch's copies can't touch this one's. */
    private val copying = Executors.newSingleThreadExecutor()
    private var listening = false
    private var waiting: List<Uri>? = null

    init {
        channel.setMethodCallHandler(this)
        copying.execute { folder.deleteRecursively() }
        arrive(activity.intent)
    }

    fun stop() {
        channel.setMethodCallHandler(null)
        copying.shutdown()
    }

    /** Handles [intent] if it is a share. Anything else, such as opening the app, is left alone. */
    fun arrive(intent: Intent?) {
        val action = intent?.action
        if (action != Intent.ACTION_SEND && action != Intent.ACTION_SEND_MULTIPLE) return
        val uris = sharedUris(intent)
        // Otherwise it would arrive again if Android brings this activity back.
        activity.intent = Intent(activity, activity.javaClass)
        if (listening) deliver(uris) else waiting = uris
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        if (call.method != "listen") {
            result.notImplemented()
            return
        }
        listening = true
        waiting?.let(::deliver)
        waiting = null
        result.success(null)
    }

    private fun deliver(uris: List<Uri>) {
        channel.invokeMethod("receiving", null)
        copying.execute {
            val paths = uris.mapNotNull(::copy)
            main.post {
                channel.invokeMethod(
                    "shared",
                    mapOf("paths" to paths, "failed" to uris.size - paths.size),
                )
            }
        }
    }

    private fun copy(uri: Uri): String? {
        // Only what another app has lent us. A `file:` address could name this app's own private
        // files, which a hostile app could try to trick it into handing back.
        if (uri.scheme != ContentResolver.SCHEME_CONTENT) return null
        return try {
            val target = File(File(folder, System.nanoTime().toString()), nameOf(uri))
            target.parentFile?.mkdirs()
            val source = activity.contentResolver.openInputStream(uri) ?: return null
            source.use { input -> target.outputStream().use { input.copyTo(it) } }
            target.path
        } catch (error: Exception) {
            Log.w(TAG, "Could not copy a shared file", error)
            null
        }
    }

    /** The file's own name, with any folders removed: the sender chooses it and may be hostile. */
    private fun nameOf(uri: Uri): String {
        var name: String? = null
        activity.contentResolver
            .query(uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null)
            ?.use { cursor -> if (cursor.moveToFirst()) name = cursor.getString(0) }
        val last = File(name ?: uri.lastPathSegment ?: "").name
        return if (last.isEmpty() || last == "." || last == "..") "shared file" else last
    }

    private fun sharedUris(intent: Intent): List<Uri> {
        return if (intent.action == Intent.ACTION_SEND) {
            listOfNotNull(streamFrom(intent))
        } else {
            streamsFrom(intent)
        }
    }

    private fun streamFrom(intent: Intent): Uri? {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            intent.getParcelableExtra(Intent.EXTRA_STREAM, Uri::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent.getParcelableExtra(Intent.EXTRA_STREAM)
        }
    }

    private fun streamsFrom(intent: Intent): List<Uri> {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM, Uri::class.java).orEmpty()
        } else {
            @Suppress("DEPRECATION")
            intent.getParcelableArrayListExtra<Uri>(Intent.EXTRA_STREAM).orEmpty()
        }
    }
}
