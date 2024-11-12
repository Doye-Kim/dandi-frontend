import React from 'react';
import { useState, useMemo } from 'react';
import { KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import styled from 'styled-components/native';
import DatePicker from 'react-native-date-picker';
import { colors } from '@/constants';
import { BASE_IMAGE_URL } from '@/api/axios';
import { responsive, responsiveVertical } from '@/utils';
import { requestCameraAndGalleryPermissions } from '@/utils/permission';
import { convertDateTimeFormat } from '@/utils/date';
import { CameraIcon } from '@/assets/icons';
import { WarningIcon } from '@/assets/icons';
import { CalendarIcon } from '@/assets/icons';
import CustomText from '@/components/common/CustomText';
import CustomButton from '@/components/common/CustomButton';
import CameraGalleryPickerModal from '@/components/lost/CameraGalleryPickerModal';
import Toast from 'react-native-toast-message';

type SOSRegisterScreenNavigationProp = StackNavigationProp<
  LostStackParamList,
  'SOSRegister'
>;

type SOSRegisterScreenProps = {
  navigation: SOSRegisterScreenNavigationProp;
};

const SOSRegisterScreen = ({ navigation }: SOSRegisterScreenProps) => {
  const [explain, setExplain] = useState('');
  const [location, setLocation] = useState('');
  const [datetime, setDatetime] = useState<Date>(new Date());
  const [isDatetimeOpen, setIsDatetimeOpen] = useState<boolean>(false);
  const [isPhotoMethodOpen, setIsPhotoMethodOpen] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const selectedDatetime = useMemo(
    () => convertDateTimeFormat(datetime),
    [datetime],
  );

  // 경로 선택 화면 이동 함수
  const goToRouteSelection = () => {
    if (!photoUrl || !explain || !location) {
      Toast.show({
        type: 'error',
        text1: '모든 항목을 입력해주세요.',
      });
      return;
    }
    navigation.navigate('RouteSelection', {
      photoUrl,
      explain,
      location,
      datetime: datetime.toISOString(),
    });
  };

  // 카메라, 갤러리 권한 요청 및 선택 모달 열기
  const uploadPhoto = async () => {
    const hasPermission = await requestCameraAndGalleryPermissions();
    if (hasPermission) {
      setIsPhotoMethodOpen(true);
    }
  };

  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <CameraBox onPress={uploadPhoto} isPhoto={photoUrl === ''}>
            {photoUrl ? (
              <Image
                source={{
                  uri: `${BASE_IMAGE_URL}${photoUrl}`,
                }}
                style={{
                  width: responsive(232),
                  height: responsive(232),
                  borderRadius: 10,
                }}
              />
            ) : (
              <CameraIcon width={responsive(232)} height={responsive(232)} />
            )}
          </CameraBox>
          {/* 카메라, 갤러리 선택 모달 */}
          <CameraGalleryPickerModal
            itemType='LOST'
            isVisible={isPhotoMethodOpen}
            handlePhotoUrl={setPhotoUrl}
            onClose={() => setIsPhotoMethodOpen(false)}
          />
          <WarningBox>
            <WarningIcon width={24} height={24} />
            <WarningText>
              신분증, 카드 등 민감 정보 포함 사진은 등록하지마세요.
            </WarningText>
          </WarningBox>
          <ContentContainer>
            <ExplainBox>
              <LabelText>상세 설명</LabelText>
              <ExplainInput
                multiline
                placeholder='분실물에 대한 설명을 적어주세요!'
                onChangeText={setExplain}
                style={{
                  fontFamily: 'OAGothic-Medium',
                  textAlignVertical: 'top',
                }}
              />
            </ExplainBox>
            <KeepExplainBox>
              <LabelText>분실 위치</LabelText>
              <KeepExplainInput
                multiline
                placeholder='물건을 분실한 장소에 대해 적어주세요!'
                onChangeText={setLocation}
                style={{
                  fontFamily: 'OAGothic-Medium',
                  textAlignVertical: 'top',
                }}
              />
            </KeepExplainBox>
            <DatetimeBox>
              <LabelText>분실 날짜</LabelText>
              <SelectedText>{selectedDatetime}</SelectedText>
              <IconButton onPress={() => setIsDatetimeOpen(true)}>
                <CalendarIcon width={24} height={24} />
              </IconButton>
            </DatetimeBox>
            {/* 날짜 선택 모달 */}
            <DatePicker
              modal
              open={isDatetimeOpen}
              date={datetime}
              mode='datetime'
              maximumDate={new Date()}
              locale='ko'
              onConfirm={(date) => {
                setIsDatetimeOpen(false);
                setDatetime(date);
              }}
              onCancel={() => {
                setIsDatetimeOpen(false);
              }}
            />
            <RegisterButton>
              <CustomButton
                title='경로 선택'
                style='enable'
                height={48}
                onPress={goToRouteSelection}
              />
            </RegisterButton>
          </ContentContainer>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SOSRegisterScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
  align-items: center;
`;

const CameraBox = styled.TouchableOpacity<{ isPhoto: boolean }>`
  width: 88%;
  padding-horizontal: ${responsive(20)}px;
  align-items: center;
  border: ${({ isPhoto }) =>
    isPhoto ? `1px dashed ${colors.GRAY_400}` : 'none'};
  border-radius: 10px;
  margin-top: ${responsiveVertical(8)}px;
  margin-bottom: ${responsiveVertical(8)}px;
`;

const WarningBox = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: ${responsive(8)}px;
  padding: ${responsive(16)}px;
`;

const WarningText = styled(CustomText)`
  color: ${colors.ERROR};
  font-size: ${responsive(11)}px;
`;

const LabelText = styled(CustomText)`
  color: ${colors.BLACK};
`;

const ContentContainer = styled.View`
  flex: 8;
  gap: ${responsive(16)}px;
  width: 100%;
  padding: 0 ${responsive(20)}px;
`;

const ExplainBox = styled.View`
  height: ${responsiveVertical(120)}px;
  gap: ${responsive(4)}px;
`;

const ExplainInput = styled.TextInput`
  flex: 1;
  border: 1px solid ${colors.GRAY_400};
  background-color: ${colors.GRAY_200};
  border-radius: 10px;
  padding: ${responsive(16)}px;
`;

const KeepExplainBox = styled.View`
  height: ${responsiveVertical(120)}px;
  gap: ${responsive(4)}px;
`;

const KeepExplainInput = styled.TextInput`
  flex: 1;
  border: 1px solid ${colors.GRAY_400};
  background-color: ${colors.GRAY_200};
  border-radius: 10px;
  padding: ${responsive(16)}px;
`;

const DatetimeBox = styled.View`
  justify-content: space-between;
  flex-direction: row;
`;

const SelectedText = styled(CustomText)`
  color: ${colors.GRAY_900};
  font-size: ${responsive(14)}px;
`;

const IconButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

const RegisterButton = styled.View`
  align-self: center;
`;
