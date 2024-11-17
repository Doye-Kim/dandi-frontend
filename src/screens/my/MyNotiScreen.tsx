import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, View, BackHandler } from 'react-native';
import ToggleItem from '@/components/my/ToggleItem';
import MyHeader from '@/components/my/MyHeader';
import { getNotiSetting, putUpdateNoti } from '@/api/auth';
import CustomText from '@/components/common/CustomText';
import { colors } from '@/constants';
import { checkErrorAndViewToast } from '@/utils';

const MyNotiScreen = () => {
  const [allNoti, setAllNoti] = useState(false);
  const [commentNoti, setCommentNoti] = useState(false);
  const [foundItemNoti, setFoundItemNoti] = useState(false);
  const [lostItemNoti, setLostItemNoti] = useState(false);

  const allNotiRef = useRef(allNoti);
  const commentNotiRef = useRef(commentNoti);
  const foundItemNotiRef = useRef(foundItemNoti);
  const lostItemNotiRef = useRef(lostItemNoti);

  useEffect(() => {
    allNotiRef.current = allNoti;
    commentNotiRef.current = commentNoti;
    foundItemNotiRef.current = foundItemNoti;
    lostItemNotiRef.current = lostItemNoti;
  }, [allNoti, commentNoti, foundItemNoti, lostItemNoti]);

  const getInitialSettings = async () => {
    try {
      const data = await getNotiSetting();
      const updatedSettings = {
        all: data.commentAlarm && data.lostItemAlarm && data.foundItemAlarm,
        foundItemAlarm: data.foundItemAlarm,
        lostItemAlarm: data.lostItemAlarm,
        commentAlarm: data.commentAlarm,
      };
      setAllNoti(updatedSettings.all);
      setCommentNoti(updatedSettings.commentAlarm);
      setFoundItemNoti(updatedSettings.foundItemAlarm);
      setLostItemNoti(updatedSettings.lostItemAlarm);
    } catch (error) {
      checkErrorAndViewToast(error);
    }
  };

  useEffect(() => {
    getInitialSettings();
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      applySettings();
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, []);

  const applySettings = async () => {
    try {
      await putUpdateNoti({
        comment: commentNotiRef.current,
        lostItem: lostItemNotiRef.current,
        foundItem: foundItemNotiRef.current,
      });
    } catch (error) {
      checkErrorAndViewToast(error);
    }
  };

  const handleToggle = (key: string) => {
    if (key === 'all') {
      const newValue = !allNoti;
      setAllNoti(newValue);
      setCommentNoti(newValue);
      setFoundItemNoti(newValue);
      setLostItemNoti(newValue);
    } else {
      if (key === 'comment') setCommentNoti((prev) => !prev);
      if (key === 'foundItem') setFoundItemNoti((prev) => !prev);
      if (key === 'lostItem') setLostItemNoti((prev) => !prev);
    }
  };

  useEffect(() => {
    if (!commentNoti || !foundItemNoti || !lostItemNoti) {
      setAllNoti(false);
    } else {
      setAllNoti(true);
    }
  }, [commentNoti, foundItemNoti, lostItemNoti]);

  return (
    <SafeAreaView>
      <MyHeader title={'알림 설정'} onPressBack={applySettings} />
      <View style={{ padding: 5 }}>
        <ToggleItem
          label={'전체 푸시 알림'}
          onToggle={() => handleToggle('all')}
          isOn={allNoti}
        />
        <ToggleItem
          label={'내 위치 주변 SOS 요청 알림'}
          onToggle={() => handleToggle('foundItem')}
          isOn={foundItemNoti}
        />
        <ToggleItem
          label={'내 위치 주변 분실물 습득 알림'}
          onToggle={() => handleToggle('lostItem')}
          isOn={lostItemNoti}
        />
        <ToggleItem
          label={'댓글 알림'}
          onToggle={() => handleToggle('comment')}
          isOn={commentNoti}
        />
        <CustomText style={{ padding: 15, color: colors.GRAY_600 }}>
          ※ 알림을 비활성화해도 목록에는 표시되며 푸시 알림만 차단됩니다.
        </CustomText>
      </View>
    </SafeAreaView>
  );
};

export default MyNotiScreen;
