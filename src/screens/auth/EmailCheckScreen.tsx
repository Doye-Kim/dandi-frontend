import { SafeAreaView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { CheckRingIcon } from '@/assets/icons';
import { authNavigations, colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';
import { AuthHomeScreenProps } from './AuthHomeScreen';
import CustomText from '@/components/common/CustomText';
import AuthButton from '@/components/auth/AuthButton';
import Toast from 'react-native-toast-message';
import { postJoinLink, postJoinVerify } from '@/api/auth';
import useAuthStore from '@/store/useAuthStore';
import LoadingScreen from '../LoadingScreen';

const EmailCheckScreen = ({ navigation }: AuthHomeScreenProps) => {
  const [timeLeft, setTimeLeft] = useState(180); // 3분 = 180초
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 요청 버튼 활성화 상태
  const email = useAuthStore((state) => state.email);
  const { resetAuthInfo } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const verify = async () => {
    setIsLoading(true);
    try {
      const data = postJoinVerify(email);
      console.log(data);
      Toast.show({
        type: 'success',
        text1: '축하합니다! 로그인을 진행해 주세요',
      });
      resetAuthInfo();

      setIsLoading(false);
      navigation.reset({ routes: [{ name: authNavigations.LOGIN }] });
    } catch (err) {
      console.log(err);
    }
  };
  const onPress = () => {
    verify();
  };

  const requestLink = async () => {
    try {
      const data = await postJoinLink(email);
      console.log(data);
      Toast.show({ type: 'success', text1: '이메일이 전송되었습니다.' });
      setTimeLeft(180);
      setIsButtonDisabled(true);
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: '알 수 없는 에러가 발생했습니다. 다시 시도해 주세요',
      });
    }
  };
  const onResendPress = () => {
    requestLink();
  };

  // 타이머 효과
  useEffect(() => {
    if (timeLeft === 0) {
      setIsButtonDisabled(false); // 3분이 지나면 버튼 활성화
      return;
    }

    // 타이머 감소 로직 (1초마다 감소)
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId); // 컴포넌트 언마운트 시 타이머 정리
  }, [timeLeft]);

  // 분, 초 표시
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 50,
          }}>
          <CheckRingIcon />
          <CustomText
            style={{
              color: colors.GRAY_900,
              fontSize: responsive(15),
              marginTop: responsiveVertical(20),
              marginHorizontal: responsive(20),
              textAlign: 'center',
            }}>
            인증 메일이 전송되었습니다. 메일함 확인 후, 아래 인증 완료 버튼을
            클릭하면 가입이 완료됩니다.
          </CustomText>
          <CustomText
            style={{
              color: colors.GRAY_500,
              fontSize: responsive(12),
              marginTop: responsiveVertical(5),
              marginBottom: responsiveVertical(20),
            }}>
            메일이 보이지 않으면 스팸 메일함도 확인해 주세요!
          </CustomText>
          <AuthButton title='인증 완료' onPress={onPress} style='enable' />
          <TouchableOpacity onPress={onResendPress} disabled={isButtonDisabled}>
            <CustomText
              style={{
                marginTop: 10,
                textDecorationLine: 'underline',
                color: isButtonDisabled ? colors.GRAY_500 : colors.ACCENT_BLUE,
              }}>
              인증번호 재요청 ({minutes}:
              {seconds < 10 ? `0${seconds}` : seconds})
            </CustomText>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </>
  );
};

export default EmailCheckScreen;
