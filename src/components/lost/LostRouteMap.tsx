import React from 'react';
import MapView from 'react-native-maps';
import styled from 'styled-components/native';
import CustomMarker from '../map/CustomMarker';
import CustomPolyline from '../map/CustomPolyLine';

const LostRouteMap = ({ routeData }) => {
  return (
    <Container>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: routeData?.[0]?.track[0]?.lat || 37.78825,
          longitude: routeData?.[0]?.track[0]?.lon || -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {routeData?.map((route, index) => (
          <React.Fragment key={route.id || index}>
            {/* 폴리라인 그리기 */}
            <CustomPolyline
              track={route.track.map((point) => ({
                latitude: point.lat,
                longitude: point.lon,
              }))}
              id={route.id}
              onPress={() => console.log(`Polyline ${route.id} pressed`)}
            />

            {/* 마커 그리기 */}
            <CustomMarker
              track={route.track.map((point) => ({
                latitude: point.lat,
                longitude: point.lon,
              }))}
              isRoute={false}
              routeId={route.id}
              isLast={index === routeData.length - 1}
              onPress={() => console.log(`Marker ${route.id} pressed`)}
            />
          </React.Fragment>
        ))}
      </MapView>
    </Container>
  );
};

export default LostRouteMap;

const Container = styled.View`
  flex: 1;
`;
