import React, { useEffect, useRef } from 'react';
import { Modal, TextInput, Animated, View } from 'react-native';
import styled from 'styled-components/native';
import {
  checkErrorAndViewToast,
  responsive,
  showCustomErrorToast,
  showErrorToast,
  validateBagName,
  validateName,
} from '@/utils';
import { colors } from '@/constants';
import HeaderText from './HeaderText';
import AuthButton from '../auth/AuthButton';
import {
  useCreateBagMutation,
  useCreateCopyBagMutation,
  useEditBagNameMutation,
} from '@/queries/bagQueries';
import { putUpdateNickname } from '@/api/auth';
import useUserStore from '@/store/useUserStore';
import InputField from '../auth/InputField';
import useForm from '@/hooks/useForm';

interface InputModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  copyBagId?: number;
  bagId?: number;
  name?: string;
  nickname?: string;
}

const InputModal = ({
  visible,
  copyBagId,
  onClose,
  onConfirm,
  bagId,
  name,
  nickname,
}: InputModalProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const nameRef = useRef<TextInput>(null);
  const { setNickname } = useUserStore();

  const checkName = useForm({
    initialValue: { name: nickname || '' },
    validate: validateName,
  });

  const checkBagName = useForm({
    initialValue: { name: name || '' },
    validate: validateBagName,
  });

  const handleDismiss = () => {
    onClose();
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const createMutation = useCreateBagMutation();
  const copyMutation = useCreateCopyBagMutation();
  const editNameMutation = useEditBagNameMutation();

  const handleConfirm = async (error: boolean) => {
    if (!error) {
      onConfirm();

      try {
        if (copyBagId) {
          await copyMutation.mutateAsync({
            bagId: copyBagId,
            name: checkBagName.values.name,
          });
        } else if (bagId) {
          await editNameMutation.mutateAsync({
            bagId: bagId,
            name: checkBagName.values.name,
          });
        } else if (nickname) {
          await putUpdateNickname(checkName.values.name);
          setNickname(checkName.values.name);
        } else {
          await createMutation.mutateAsync(checkBagName.values.name);
        }
      } catch (error) {
        checkErrorAndViewToast(error);
      } finally {
        checkName.reset();
        checkBagName.reset();
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='none'
      onRequestClose={handleDismiss}>
      <ModalBackground onPress={handleDismiss}>
        <AnimatedModalContainer
          style={{
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [500, 0],
                }),
              },
            ],
          }}>
          <View style={{ marginBottom: 20 }}>
            <HeaderText>
              {bagId
                ? '가방 이름 변경'
                : nickname
                ? '닉네임 변경'
                : '나만의 가방 만들기'}
            </HeaderText>
          </View>
          {nickname ? (
            <>
              <InputField
                ref={nameRef}
                placeholder={'닉네임을 입력해주세요'}
                error={checkName.errors.name}
                touched={checkName.touched.name}
                returnKeyType='join'
                blurOnSubmit={false}
                {...checkName.getTextInputProps('name')}
              />
              <AuthButton
                title='확인'
                onPress={() => handleConfirm(!!checkName.errors.name)}
                style={checkName.errors.name ? 'disabled' : 'enable'}
              />
            </>
          ) : (
            <>
              <InputField
                ref={nameRef}
                placeholder={'가방 이름을 입력해주세요'}
                error={checkBagName.errors.name}
                touched={checkBagName.touched.name}
                returnKeyType='join'
                blurOnSubmit={false}
                {...checkBagName.getTextInputProps('name')}
              />
              <AuthButton
                title='확인'
                onPress={() => handleConfirm(!!checkBagName.errors.name)}
                style={checkBagName.errors.name ? 'disabled' : 'enable'}
              />
            </>
          )}
        </AnimatedModalContainer>
      </ModalBackground>
    </Modal>
  );
};

export default InputModal;

const ModalBackground = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const AnimatedModalContainer = styled(Animated.View)`
  width: ${responsive(372)}px;
  padding: ${responsive(20)}px;
  position: absolute;
  bottom: 0;
  background-color: ${colors.WHITE};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  justify-content: center;
  align-items: center;
`;
