import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';
import { requestLocationPermission } from '@/utils';
import { locationType } from '@/screens/map/MapMainScreen';

const { LocationServiceModule } = NativeModules;
const locationEventEmitter = new NativeEventEmitter(LocationServiceModule);

export const useLocationTracking = (
  setLocations: (locations: locationType[]) => void,
  setCurrentLocation: (currentLocation: locationType) => void,
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
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
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
            setLocations((prev: locationType[]) => {
              const newLocations = [
                ...prev,
                {
                  latitude: locationData.latitude,
                  longitude: locationData.longitude,
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