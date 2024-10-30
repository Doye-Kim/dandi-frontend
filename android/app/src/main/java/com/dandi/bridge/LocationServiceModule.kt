package com.dandi.bridge

import android.content.Intent
import android.util.Log
import com.dandi.services.LocationService
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class LocationServiceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    init {
        LocationEventEmitter.initialize(reactContext)
    }

    override fun getName(): String {
        return "LocationServiceModule"
    }

    @ReactMethod
    fun startLocationService() {
        Log.d("LocationServiceModule", "startLocationService called")
        val serviceIntent = Intent(reactApplicationContext, LocationService::class.java)
        reactApplicationContext.startService(serviceIntent)
    }

    @ReactMethod
    fun stopLocationService() {
        val serviceIntent = Intent(reactApplicationContext, LocationService::class.java)
        reactApplicationContext.stopService(serviceIntent)
    }

    @ReactMethod
    fun setMovingState(isMoving: Boolean) {
        LocationService.setMovingState(isMoving) // LocationService의 이동 상태 업데이트
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // 이벤트 리스너가 추가될 때 호출되는 메서드 (추가 작업 필요 없음)
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // 이벤트 리스너가 제거될 때 호출되는 메서드 (추가 작업 필요 없음)
    }
}
