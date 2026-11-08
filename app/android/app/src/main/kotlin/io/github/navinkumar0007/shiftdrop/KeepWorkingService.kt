package io.github.navinkumar0007.shiftdrop

import android.app.ActivityManager
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat

/**
 * Keeps the app alive while a conversion runs, so leaving the app doesn't get a long job killed.
 * Android only allows that with a notification on show, which also tells people work is still
 * going. Dart starts it when a job starts and stops it when the last one ends. It does no work of
 * its own: the job runs where it always does.
 */
class KeepWorkingService : Service() {
    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val title = intent?.getStringExtra(EXTRA_TITLE) ?: "ShiftDrop"
        val text = intent?.getStringExtra(EXTRA_TEXT) ?: ""
        ServiceCompat.startForeground(this, NOTIFICATION_ID, notification(title, text), serviceType())
        // If Android stops it anyway, it shouldn't come back by itself: the job it kept is gone.
        return START_NOT_STICKY
    }

    /** Android 15 gives this kind of service a time limit. Stopping is all that's left to do. */
    override fun onTimeout(startId: Int, fgsType: Int) {
        stopSelf()
    }

    private fun notification(title: String, text: String): Notification {
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(CHANNEL_ID, title, NotificationManager.IMPORTANCE_LOW)
            channel.setShowBadge(false)
            manager.createNotificationChannel(channel)
        }
        val open = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_shiftdrop)
            .setContentTitle(title)
            .setContentText(text)
            .setStyle(NotificationCompat.BigTextStyle().bigText(text))
            .setContentIntent(open)
            .setOngoing(true)
            .setSilent(true)
            .setProgress(0, 0, true)
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
            .build()
    }

    private fun serviceType(): Int = when {
        Build.VERSION.SDK_INT >= 35 -> ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROCESSING
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q -> ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC
        else -> 0
    }

    companion object {
        private const val CHANNEL_ID = "converting"
        private const val NOTIFICATION_ID = 7302
        private const val EXTRA_TITLE = "title"
        private const val EXTRA_TEXT = "text"

        /** Whether Android has it running in the foreground, as tests ask. */
        @Suppress("DEPRECATION") // Still answers for an app's own services.
        fun isRunning(context: Context): Boolean {
            val manager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            return manager.getRunningServices(Int.MAX_VALUE).any {
                it.service.className == KeepWorkingService::class.java.name && it.foreground
            }
        }

        fun start(context: Context, title: String, text: String) {
            val intent = Intent(context, KeepWorkingService::class.java)
                .putExtra(EXTRA_TITLE, title)
                .putExtra(EXTRA_TEXT, text)
            ContextCompat.startForegroundService(context, intent)
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, KeepWorkingService::class.java))
        }
    }
}
