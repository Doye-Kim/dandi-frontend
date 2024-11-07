import React from 'react';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';
import { CameraIcon } from '@/assets/icons';
import { WarningIcon } from '@/assets/icons';
import { CalendarIcon } from '@/assets/icons';
import CustomText from '@/components/common/CustomText';
import CustomButton from '@/components/common/CustomButton';

type SOSRegisterScreenNavigationProp = StackNavigationProp<
  LostStackParamList,
  'SOSRegister'
>;

type SOSRegisterScreenProps = {
  navigation: SOSRegisterScreenNavigationProp;
};

const SOSRegisterScreen = ({ navigation }: SOSRegisterScreenProps) => {
  // todo: 상태 바인딩 및 초기화 및 핸들러 함수 정의
  const [explain, setExplain] = useState('');
  const [location, setLocation] = useState('');
  const [keepLocation, setKeepLocation] = useState('');

  const goToRouteSelection = () => {
    navigation.navigate('RouteSelection');
    console.log('경로 선택 버튼 클릭');
  };
  // todo: 화면 구성, 스타일 적용
  // todo: 카메라 사진 변경
  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <CameraBox>
            <CameraIcon width={responsive(232)} height={responsive(232)} />
          </CameraBox>
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
                style={{
                  fontFamily: 'OAGothic-Medium',
                  textAlignVertical: 'top',
                }}
              />
            </KeepExplainBox>
            <DatetimeBox>
              <LabelText>분실 날짜</LabelText>
              <SelectedText>2024.10.24 16:20</SelectedText>
              <IconButton>
                <CalendarIcon width={24} height={24} />
              </IconButton>
            </DatetimeBox>
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

const CameraBox = styled.TouchableOpacity`
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
