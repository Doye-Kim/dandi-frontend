import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';
import { requestLocationPermission } from '@/utils';
import { LatLng, LatLon } from '@/api/map';

const { LocationServiceModule } = NativeModules;
const locationEventEmitter = new NativeEventEmitter(LocationServiceModule);

export const useLocationTracking = (
  setLocations: Dispatch<SetStateAction<LatLon[]>>,
  setCurrentLocation: (currentLocation: LatLng) => void,
) => {
  useEffect(() => {
    let subscription: EmitterSubscription;
    let watchId: number;

    const initializeLocationTracking = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        watchId = Geolocation.watchPosition(
          pos => {
            console.log('current position:', pos.coords);
            setCurrentLocation({
              latitude: Number(pos.coords.latitude.toFixed(4)),
              longitude: Number(pos.coords.longitude.toFixed(4)),
            });
          },
          err => console.error('Geolocation error:', err),
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
            distanceFilter: 5,
          },
        );

        LocationServiceModule.startLocationService();

        subscription = locationEventEmitter.addListener(
          'LocationUpdated',
          locationData => {
            setLocations((prev: LatLon[]) => {
              const newLocations = [
                ...prev,
                {
                  lat: Number(locationData.latitude.toFixed(4)),
                  lon: Number(locationData.longitude.toFixed(4)),
                },
              ];
              if (newLocations.length > 60) newLocations.shift();
              return newLocations;
            });
          },
        );
      }
    };

    initializeLocationTracking();

    return () => {
      if (subscription) subscription.remove();
      LocationServiceModule.stopLocationService();
      if (watchId) Geolocation.clearWatch(watchId);
    };
  }, [setLocations, setCurrentLocation]);
};
