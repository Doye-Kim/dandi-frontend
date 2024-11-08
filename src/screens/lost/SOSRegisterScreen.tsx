import React from 'react';
import { useState, useMemo } from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import styled from 'styled-components/native';
import DatePicker from 'react-native-date-picker';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';
import { convertDateTimeFormat } from '@/utils/date';
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
  const [datetime, setDatetime] = useState<Date>(new Date());
  const [isDatetimeOpen, setIsDatetimeOpen] = useState<boolean>(false);
  const selectedDatetime = useMemo(
    () => convertDateTimeFormat(datetime),
    [datetime],
  );

  // 경로 선택 화면 이동 함수
  const goToRouteSelection = () => {
    navigation.navigate('RouteSelection');
    console.log('경로 선택 버튼 클릭');
  };

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
