import ListItem from '@/components/my/ListItem';
import Section from '@/components/my/Section';
import { myNavigations } from '@/constants';
import { MyStackParamList } from '@/navigations/stack/MyStackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type MyScreenProps = {
  navigation: StackNavigationProp<
    MyStackParamList,
    typeof myNavigations.MY_MAIN
  >;
};

// #todo: encrypted store에 저장해둘 유저 정보 가져와서 사용하기
// #todo: 내가 쓴 분실물 목록, SOS 목록 원래 목록에서 데이터 변경해 가져오기
const MyMainScreen = ({ navigation }: MyScreenProps) => {
  const handlePressNickname = () => {};
  const handlePressPassword = () => {
    navigation.navigate(myNavigations.PASSWORD_UPDATE);
  };
  const handlePressNoti = () => {
    navigation.navigate(myNavigations.MY_NOTI);
  };
  const handlePressSOS = () => {
    console.log('SOS');
  };
  const handlePressLost = () => {
    console.log('LOST');
  };
  const handleLogout = () => {
    console.log('logout');
  };
  const handlePressWithdraw = () => {
    console.log('withdraw');
  };
  const handlePressInquire = () => {};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 10 }}>
        <Section title='내 정보'>
          <ListItem
            label='닉네임'
            rightText='지지'
            onPress={handlePressNickname}
          />
          <ListItem label='이메일' rightText='kmdy125@gmail.com' disabled />
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
          <ListItem label='문의하기' onPress={handlePressInquire} />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};
export default MyMainScreen;
