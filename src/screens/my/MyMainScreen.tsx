import { useState } from 'react';
import { ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Mailer from 'react-native-mail';
import { MyStackParamList } from '@/navigations/stack/MyStackNavigator';
import { removeEncryptStorage } from '@/utils/encryptedStorage';
import { checkErrorAndViewToast, showErrorToast, showToast } from '@/utils';
import { deleteUser, logout } from '@/api/auth';
import { myNavigations } from '@/constants';
import CustomModal from '@/components/common/CustomModal';
import InputModal from '@/components/common/InputModal';
import ListItem from '@/components/my/ListItem';
import useUserStore from '@/store/useUserStore';
import Section from '@/components/my/Section';

export type MyScreenProps = {
  navigation: StackNavigationProp<
    MyStackParamList,
    typeof myNavigations.MY_MAIN
  >;
};

// #todo: 내가 쓴 분실물 목록, SOS 목록 원래 목록에서 데이터 변경해 가져오기
const MyMainScreen = ({ navigation }: MyScreenProps) => {
  const nickname = useUserStore((state) => state.nickname);
  const email = useUserStore((state) => state.email);
  const [isOpenNameUpdate, setIsOpenNameUpdate] = useState(false);
  const { setIsLogin } = useUserStore();

  const handlePressNickname = () => {
    setIsOpenNameUpdate(true);
  };
  const handlePressPassword = () => {
    navigation.navigate(myNavigations.PASSWORD_UPDATE);
  };
  const handlePressNoti = () => {
    navigation.navigate(myNavigations.MY_NOTI);
  };
  const handlePressSOS = () => {
    navigation.navigate(myNavigations.MY_SOS);
  };
  const handlePressLost = () => {
    navigation.navigate(myNavigations.MY_PICKUP);
  };
  const handleLogout = async () => {
    try {
      await logout();
      setIsLogin(false);
      removeEncryptStorage('accessToken');
      removeEncryptStorage('refreshToken');
      showToast('로그아웃 되었습니다.');
    } catch (error) {
      checkErrorAndViewToast(error);
    }
  };

  const handlePressWithDrawConfirm = async () => {
    try {
      await deleteUser();
      setIsLogin(false);
      removeEncryptStorage('accessToken');
      removeEncryptStorage('refreshToken');
      showToast('탈퇴되었습니다.');
    } catch (error) {
      checkErrorAndViewToast(error);
    }
  };
  const [isOpenWithdraw, setIsOpenWithdraw] = useState<boolean>(false);
  const handlePressWithdraw = () => {
    setIsOpenWithdraw(true);
  };

  const handleSendMail = () => {
    Mailer.mail(
      {
        subject: '문의 및 건의하기',
        recipients: ['dandi.official.biz@gmail.com'],
        body: '1. 문의 내용<br><br><br><br><br>2. 단디 메일 계정<br><br><br><br>★ 문의 관련 스크린샷을 첨부하시면 더욱 빠른 확인이 가능합니다.<br><br>-----------------------------------<br><br> 문의에 포함된 개인정보와 연락처 정보를 수집, 이용할 수 있습니다. 다만 이러한 정보는 답변을 위한 목적으로만 처리됩니다.',
        isHTML: true,
      },
      (error, event) => {
        console.log(error, event);
        if (error) {
          showErrorToast('MAIL_ERROR');
        } else if (event === 'sent') {
          showToast(
            '메일이 전송되었습니다. 확인 후 빠른 시일 내에 답변 드리겠습니다. :)',
          );
        }
      },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 10 }}>
        <Section title='내 정보'>
          <ListItem
            label='닉네임'
            rightText={nickname}
            onPress={handlePressNickname}
          />
          <ListItem label='이메일' rightText={email} disabled />
          <ListItem
            label='비밀번호 변경'
            showIcon
            onPress={handlePressPassword}
          />
          <ListItem label='알림 설정' showIcon onPress={handlePressNoti} />
        </Section>

        <Section title='분실물'>
          <ListItem label='내가 등록한 SOS' showIcon onPress={handlePressSOS} />
          <ListItem
            label='내가 신고한 분실물'
            showIcon
            onPress={handlePressLost}
          />
        </Section>

        <Section title='그외'>
          <ListItem label='로그아웃' onPress={handleLogout} />
          <ListItem label='회원 탈퇴' onPress={handlePressWithdraw} />
          <ListItem label='문의하기' onPress={handleSendMail} />
        </Section>
      </ScrollView>
      <CustomModal
        visible={isOpenWithdraw}
        category='WITHDRAW'
        onClose={() => setIsOpenWithdraw(false)}
        onCancel={() => setIsOpenWithdraw(false)}
        onConfirm={handlePressWithDrawConfirm}
      />
      <InputModal
        visible={isOpenNameUpdate}
        onClose={() => setIsOpenNameUpdate(false)}
        onConfirm={() => setIsOpenNameUpdate(false)}
        nickname={nickname}
      />
    </SafeAreaView>
  );
};
export default MyMainScreen;
