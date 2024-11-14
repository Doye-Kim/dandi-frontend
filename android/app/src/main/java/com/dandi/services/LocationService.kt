package com.dandi.services

import android.app.Service
import android.util.Log
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Intent
import android.location.Location
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.dandi.bridge.LocationEventEmitter
import com.google.android.gms.location.*

class LocationService : Service() {

    private lateinit var fusedLocationProviderClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback

    companion object {
        var isMoving: Boolean = false

        private var instance: LocationService? = null

        fun setMovingState(moving: Boolean) {
            isMoving = moving
            instance?.updateLocationAccuracy() // 이동 상태에 따라 정확도 업데이트
        }
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this)
        setupLocationCallback()
        Log.d("LocationService", "Service onCreate called")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("LocationService", "Service onStartCommand called")
        startForegroundService()
        startLocationUpdates()
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d("LocationService", "Service onDestroy called")
        stopLocationUpdates()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun updateLocationAccuracy() {
        val locationRequest = LocationRequest.create().apply {
            interval = 10000
            fastestInterval = 5000
            priority = if (isMoving) {
                LocationRequest.PRIORITY_HIGH_ACCURACY
            } else {
                LocationRequest.PRIORITY_BALANCED_POWER_ACCURACY
            }
        }
        fusedLocationProviderClient.removeLocationUpdates(locationCallback)
        fusedLocationProviderClient.requestLocationUpdates(locationRequest, locationCallback, null)
    }


    private fun setupLocationCallback() {
        locationCallback = object : LocationCallback() {
            private var lastUpdateTime = 0L
            private val updateInterval = 10000L // 10초 간격

            override fun onLocationResult(locationResult: LocationResult) {
                val currentTime = System.currentTimeMillis()
                if (currentTime - lastUpdateTime >= updateInterval) {
                    lastUpdateTime = currentTime
                    for (location in locationResult.locations) {
                        sendLocationToReactNative(location)
                    }
                }
            }
        }
    }

    private fun startLocationUpdates() {
        updateLocationAccuracy()
    }

    private fun stopLocationUpdates() {
        fusedLocationProviderClient.removeLocationUpdates(locationCallback)
    }

    private fun startForegroundService() {
        val channelId = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createNotificationChannel("location_service", "Location Service")
        } else {
            ""
        }

        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("위치 정보 서비스")
            .setContentText("백그라운드 위치 정보를 수집 중입니다.")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .build()

        startForeground(1, notification)
    }

    private fun createNotificationChannel(channelId: String, channelName: String): String {
        val chan = NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_DEFAULT)
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(chan)
        return channelId
    }

    private fun sendLocationToReactNative(location: Location) {
        try {
            LocationEventEmitter.sendLocationEvent(location)
        } catch (e: Exception) {
            Log.e("LocationService", "Error sending location to React Native: ${e.message}")
        }
    }
}
