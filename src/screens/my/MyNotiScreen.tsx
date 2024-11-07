import CustomText from '@/components/common/CustomText';
import ListItem from '@/components/my/ListItem';
import MyHeader from '@/components/my/MyHeader';
import ToggleItem from '@/components/my/ToggleItem';
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';

const MyNotiScreen = () => {
  // #todo 사용자의 알림 정보로 초기값을 설정해 둬야 함
  const [isOnWhole, setIsOnWhole] = useState(false);
  const [isOnSOS, setIsOnSOS] = useState(false);
  const [isOnLost, setIsOnLost] = useState(false);

  const handleWholeNoti = () => {
    setIsOnWhole((prev) => {
      if (prev) {
        setIsOnSOS(false);
        setIsOnLost(false);
      }
      return !prev;
    });
  };
  const handleSOSNoti = () => {
    setIsOnSOS((prev) => !prev);
  };
  const handleLostNoti = () => {
    setIsOnLost((prev) => !prev);
  };
  return (
    <SafeAreaView>
      <MyHeader title={'알림 설정'} />
      <View style={{ padding: 5 }}>
        <ToggleItem
          label={'전체 푸시 알림'}
          onToggle={handleWholeNoti}
          isOn={isOnWhole}
        />
        <ToggleItem
          label={'내 위치 주변 SOS 요청 알림'}
          onToggle={handleSOSNoti}
          isOn={isOnSOS}
        />
        <ToggleItem
          label={'내 위치 주변 분실물 습득 알림'}
          onToggle={handleLostNoti}
          isOn={isOnLost}
        />
      </View>
    </SafeAreaView>
  );
};

export default MyNotiScreen;
