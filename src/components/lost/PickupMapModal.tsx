import React, { useState } from 'react';
import { Modal, Button } from 'react-native';
import styled from 'styled-components/native';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '@/constants';
import CustomButton from '../common/CustomButton';

interface PickupMapModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: { latitude: number; longitude: number }) => void;
}

const PickupMapModal = ({
  visible,
  onClose,
  onSelectLocation,
}: PickupMapModalProps) => {
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 35.0894681,
    longitude: 128.8535056,
  });

  const handleSelectLocation = (event) => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  return (
    <Modal visible={visible} animationType='fade' transparent={true}>
      <Container>
        <MapContainer>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
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
              width={100}
              height={40}
              fontSize={12}
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
  height: 40%;
  border-radius: 10px;
  background-color: ${colors.WHITE};
  overflow: hidden;
  padding-top: 10px;
  padding-horizontal: 10px;
`;

const ButtonBox = styled.View`
  align-self: center;
`;
