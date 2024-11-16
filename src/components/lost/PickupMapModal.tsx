import React from 'react';
import { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import MapView, { LatLng, Marker, MapPressEvent } from 'react-native-maps';
import { colors } from '@/constants';
import CustomButton from '../common/CustomButton';
import { responsive, responsiveVertical } from '@/utils';

interface PickupMapModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: LatLng) => void;
  initialLocation: LatLng;
}

const PickupMapModal = ({
  visible,
  onClose,
  onSelectLocation,
  initialLocation,
}: PickupMapModalProps) => {
  const [selectedLocation, setSelectedLocation] =
    useState<LatLng>(initialLocation);

  useEffect(() => {
    setSelectedLocation(initialLocation);
  }, [initialLocation]);

  const handleSelectLocation = (event: MapPressEvent) => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  return (
    <Modal visible={visible} animationType='fade' transparent={true}>
      <Container>
        <MapContainer>
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
            onPress={handleSelectLocation}>
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                zIndex={10}
                anchor={{ x: 0.5, y: 0.5 }}
              />
            )}
          </MapView>
          <ButtonBox>
            <CustomButton
              title='위치 선택'
              style='enable'
              width={responsive(100)}
              height={responsiveVertical(48)}
              fontSize={responsiveVertical(12)}
              onPress={() => {
                onSelectLocation(selectedLocation);
                onClose();
              }}
            />
          </ButtonBox>
        </MapContainer>
      </Container>
    </Modal>
  );
};

export default PickupMapModal;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const MapContainer = styled.View`
  width: 90%;
  height: 50%;
  border-radius: 10px;
  background-color: ${colors.WHITE};
  overflow: hidden;
  padding-top: 10px;
  padding-horizontal: 10px;
`;

const ButtonBox = styled.View`
  align-self: center;
`;
