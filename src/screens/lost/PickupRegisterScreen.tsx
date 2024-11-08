import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { LatLng } from 'react-native-maps';
import DatePicker from 'react-native-date-picker';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';
import { convertDateTimeFormat } from '@/utils/date';
import { CameraIcon } from '@/assets/icons';
import { WarningIcon } from '@/assets/icons';
import { SimpleMarkerIcon } from '@/assets/icons';
import { CalendarIcon } from '@/assets/icons';
import CustomText from '@/components/common/CustomText';
import CustomButton from '@/components/common/CustomButton';
import PickupMapModal from '@/components/lost/PickupMapModal';

const PickupRegisterScreen = () => {
  // todo: 상태 바인딩 및 초기화 및 핸들러 함수 정의
  const [explain, setExplain] = useState<string>('');
  // todo: 위치 정보를 현재 위치로 초기화
  const [location, setLocation] = useState<LatLng>({
    latitude: 0,
    longitude: 0,
  });
  const [keepLocation, setKeepLocation] = useState<string>('');
  const [datetime, setDatetime] = useState<Date>(new Date());
  const [isMapModalVisible, setIsMapModalVisible] = useState<boolean>(false);
  const [isDatetimeOpen, setIsDatetimeOpen] = useState<boolean>(false);
  const selectedDatetime = useMemo(
    () => convertDateTimeFormat(datetime),
    [datetime],
  );

  const handleRegister = () => {
    console.log('등록 버튼 클릭');
  };
  // todo: 카메라 사진 변경
  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <CameraBox>
            <CameraIcon width={responsive(232)} height={responsive(232)} />
          </CameraBox>
          <WarningBox>
            <WarningIcon width={responsive(24)} height={responsive(24)} />
            <WarningText>
              신분증, 카드 등 민감 정보 포함 사진은 등록하지마세요.
            </WarningText>
          </WarningBox>
          <ContentContainer>
            <ExplainBox>
              <LabelText>상세 설명</LabelText>
              <ExplainInput
                multiline
                placeholder='습득물에 대한 설명을 적어주세요!'
                onChangeText={setExplain}
                style={{
                  fontFamily: 'OAGothic-Medium',
                  textAlignVertical: 'top',
                }}
              />
            </ExplainBox>
            <LocationBox>
              <LabelText>습득 장소</LabelText>
              <SelectedText>거제시 중곡로 42</SelectedText>
              <IconButton onPress={() => setIsMapModalVisible(true)}>
                <SimpleMarkerIcon width={24} height={24} />
              </IconButton>
            </LocationBox>
            {/* 위치 선택 모달 */}
            <PickupMapModal
              visible={isMapModalVisible}
              onClose={() => setIsMapModalVisible(false)}
              onSelectLocation={(location: LatLng) => {
                setLocation(location);
              }}
            />
            <KeepExplainBox>
              <LabelText>보관 장소</LabelText>
              <KeepExplainInput
                multiline
                placeholder='습득물을 보관한 장소를 적어주세요!'
                onChangeText={setKeepLocation}
                style={{
                  fontFamily: 'OAGothic-Medium',
                  textAlignVertical: 'top',
                }}
              />
            </KeepExplainBox>
            <DatetimeBox>
              <LabelText>습득 날짜</LabelText>
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
                title='등록'
                style='enable'
                height={48}
                onPress={handleRegister}
              />
            </RegisterButton>
          </ContentContainer>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PickupRegisterScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
  align-items: center;
`;

const CameraBox = styled.TouchableOpacity`
  width: 88%;
  padding-horizontal: ${responsive(20)}px;
  align-items: center;
  border: 1px dashed ${colors.GRAY_400};
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

const LocationBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
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
