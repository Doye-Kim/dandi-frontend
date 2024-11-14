import React from 'react';
import { Modal } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import styled from 'styled-components/native';
import Toast from 'react-native-toast-message';
import { colors } from '@/constants/colors';
import { isAxiosError } from 'axios';
import { responsive } from '@/utils/common';
import { uploadImage } from '@/api/lost';
import CustomText from '../common/CustomText';
import { showCustomErrorToast } from '@/utils';

interface CameraGalleryPickerModalProps {
  itemType: 'FOUND' | 'LOST';
  isVisible: boolean;
  handlePhotoUrl: (url: string) => void;
  onClose: () => void;
}

const CameraGalleryPickerModal = ({
  itemType,
  isVisible,
  handlePhotoUrl,
  onClose,
}: CameraGalleryPickerModalProps) => {
  // 이미지 업로드
  const handleUploadImage = async (image: any) => {
    const formData = new FormData();
    const fileName = image.filename || `image.${image.mime.split('/')[1]}`;

    formData.append('image', {
      uri: image.path,
      type: image.mime,
      name: fileName,
    });

    try {
      const data = await uploadImage(formData, itemType);
      handlePhotoUrl(data);
    } catch (error) {
      if (isAxiosError(error)) {
        showCustomErrorToast(error.response?.data.message);
      }
    }
  };
  // 파일 크기 초과 토스트 메시지
  const showToastFileSizeExceeded = () => {
    showCustomErrorToast('10MB 이하의 파일만 업로드 가능합니다.');
  };

  // 카메라로 사진 촬영
  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: responsive(232),
        height: responsive(232),
        cropping: true,
        mediaType: 'photo',
        useFrontCamera: true,
        // 안드로이드 전용
        enableRotationGesture: true,
      });
      const fileSizeInMB = image.size / (1024 * 1024);
      const maxFileSize = 10;

      if (fileSizeInMB > maxFileSize) {
        showToastFileSizeExceeded();
      } else {
        handleUploadImage(image);
      }
      return;
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
    }
  };
  // 갤러리에서 이미지 선택
  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: responsive(232),
        height: responsive(232),
        cropping: true,
        mediaType: 'photo',
        useFrontCamera: true,
        // 안드로이드 전용
        enableRotationGesture: true,
      });
      console.log(image.path);

      const fileSizeInMB = image.size / (1024 * 1024);
      const maxFileSize = 10;

      if (fileSizeInMB > maxFileSize) {
        showToastFileSizeExceeded();
      } else {
        handleUploadImage(image);
      }
      return;
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      animationType='fade'>
      <ModalBackground>
        <ModalContainer>
          <OptionButton onPress={openCamera}>
            <OptionText>사진 촬영</OptionText>
          </OptionButton>
          <OptionButton onPress={openGallery}>
            <OptionText>갤러리에서 선택</OptionText>
          </OptionButton>
          <CancelButton onPress={onClose}>
            <CancelText>취소</CancelText>
          </CancelButton>
        </ModalContainer>
      </ModalBackground>
    </Modal>
  );
};

export default CameraGalleryPickerModal;

const ModalBackground = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.View`
  width: 80%;
  align-items: center;
  border-radius: 10px;
  padding: ${responsive(20)}px;
  background-color: white;
`;

const OptionButton = styled.TouchableOpacity`
  width: 100%;
  align-items: center;
  padding-vertical: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_400};
`;

const OptionText = styled(CustomText)`
  font-size: ${responsive(16)}px;
  color: ${colors.BLUE_400};
`;

const CancelButton = styled.TouchableOpacity`
  width: 100%;
  padding-vertical: 15px;
  align-items: center;
`;

const CancelText = styled(CustomText)`
  font-size: ${responsive(16)}px;
  color: ${colors.ERROR};
`;
