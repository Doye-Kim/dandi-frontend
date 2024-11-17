import React, { useEffect } from 'react';
import MapView from 'react-native-maps';
import styled from 'styled-components/native';
import { LatLon } from '@/api/map';
import CustomPolyline from '@/components/map/CustomPolyLine';
import CustomMarker from '@/components/map/CustomMarker';

const LostRouteMap = ({
  routeData,
  routeId,
  onPress,
}: {
  routeData: LatLon[] | null;
  routeId: number | null;
  onPress: (id: number) => void;
}) => {
  useEffect(() => {
    console.log('routeId', routeId);
  }, [routeData]);

  return (
    <Container>
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: routeData?.[0]?.lat || 37.78825,
          longitude: routeData?.[0]?.lon || -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {routeData && routeData.length > 0 && (
          <CustomPolyline
            track={routeData.map((point) => ({
              latitude: point.lat || 35.0894681,
              longitude: point.lon || 128.8535056,
            }))}
            id={routeData[0].lat}
            onPress={() => {}}
          />
        )}
        {routeData && routeData.length > 0 && (
          <CustomMarker
            track={[
              {
                latitude: routeData[0].lat,
                longitude: routeData[0].lon,
              },
            ]}
            isRoute={true}
            routeId={routeId || 0}
            isLast={false}
            onPress={(id) => {
              if (id) {
                onPress(id);
              } else {
                console.error('Invalid routeId:', id);
              }
            }}
          />
        )}
      </MapView>
    </Container>
  );
};

export default LostRouteMap;

const Container = styled.View`
  flex: 1;
`;
