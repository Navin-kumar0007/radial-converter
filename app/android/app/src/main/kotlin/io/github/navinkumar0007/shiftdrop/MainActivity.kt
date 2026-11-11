package io.github.navinkumar0007.shiftdrop

import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    private var media: MediaEngine? = null
    private var share: ShareReceiver? = null

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        media = MediaEngine(this, flutterEngine.dartExecutor.binaryMessenger)
        share = ShareReceiver(this, flutterEngine.dartExecutor.binaryMessenger)
        // Opens the newest version's page in the browser. The app itself has no permission to use
        // the internet, and this needs none: the browser does the fetching.
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "radial/pages")
            .setMethodCallHandler { call, result ->
                val url = call.argument<String>("url")
                if (call.method != "open" || url == null || !url.startsWith("https://")) {
                    result.success(false)
                    return@setMethodCallHandler
                }
                try {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    result.success(true)
                } catch (error: ActivityNotFoundException) {
                    result.success(false)
                }
            }
    }

    override fun cleanUpFlutterEngine(flutterEngine: FlutterEngine) {
        media?.stop()
        media = null
        share?.stop()
        share = null
        super.cleanUpFlutterEngine(flutterEngine)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        share?.arrive(intent)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (media?.onSaveResult(requestCode, resultCode, data) != true) {
            super.onActivityResult(requestCode, resultCode, data)
        }
    }
}
