import React from 'react';
import MapView from 'react-native-maps';
import styled from 'styled-components/native';
import { LatLon } from '@/api/map';
import CustomPolyline from '../map/CustomPolyLine';

const LostRouteMap = ({ routeData }: { routeData: LatLon[] | null }) => {
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
      </MapView>
    </Container>
  );
};

export default LostRouteMap;

const Container = styled.View`
  flex: 1;
`;
