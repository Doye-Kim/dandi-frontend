import React from 'react';
import { useState } from 'react';
import { FlatList } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import CustomText from '@/components/common/CustomText';
import CustomButton from '@/components/common/CustomButton';
import RouteListItem from '@/components/lost/RouteListItem';

const RouteSelectionScreen = () => {
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [selectedRoutes, setSelectedRoutes] = useState<number[]>([]);

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <RouteListItem />
      <CustomButton
        title='등록'
        style='enable'
        height={48}
        onPress={() => console.log('SOS 등록')}
      />
    </>
  );
};

export default RouteSelectionScreen;
