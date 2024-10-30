package com.dandi.bridge

import android.location.Location
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule

object LocationEventEmitter {
    private var reactContext: ReactApplicationContext? = null

    fun initialize(context: ReactApplicationContext) {
        reactContext = context
    }

    fun sendLocationEvent(location: Location) {
        val params = Arguments.createMap().apply {
            putDouble("latitude", location.latitude)
            putDouble("longitude", location.longitude)
        }

        reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit("LocationUpdated", params)
    }
}
