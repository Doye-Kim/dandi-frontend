import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, BackHandler } from 'react-native';
import ToggleItem from '@/components/my/ToggleItem';
import MyHeader from '@/components/my/MyHeader';
import { TargetOption, getNotiSetting, putUpdateNoti } from '@/api/auth';
import CustomText from '@/components/common/CustomText';
import { colors } from '@/constants';
import { checkErrorAndViewToast } from '@/utils';

const MyNotiScreen = () => {
  const [initialSettings, setInitialSettings] = useState({
    ALL: false,
    FOUND_ITEM: false,
    LOST_ITEM: false,
    COMMENT: false,
  });

  const [settings, setSettings] = useState({
    ALL: false,
    FOUND_ITEM: false,
    LOST_ITEM: false,
    COMMENT: false,
  });

  const getInitialSettings = async () => {
    try {
      const data = await getNotiSetting();
      const updatedSettings = {
        ALL: data.commentAlarm && data.lostItemAlarm && data.foundItemAlarm,
        FOUND_ITEM: data.foundItemAlarm,
        LOST_ITEM: data.lostItemAlarm,
        COMMENT: data.commentAlarm,
      };
      setInitialSettings(updatedSettings);
      setSettings(updatedSettings);
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

  const handleToggle = (target: TargetOption) => {
    setSettings((prev) => {
      if (target === 'ALL') {
        const newValue = !prev.ALL;
        return {
          ALL: newValue,
          FOUND_ITEM: newValue,
          LOST_ITEM: newValue,
          COMMENT: newValue,
        };
      } else {
        return {
          ...prev,
          [target]: !prev[target],
        };
      }
    });
  };

  const applySettings = async () => {
    const updatedSettings = (Object.keys(settings) as TargetOption[]).reduce(
      (acc, key) => {
        if (settings[key] !== initialSettings[key]) {
          acc[key] = settings[key];
        }
        return acc;
      },
      {} as Partial<typeof settings>,
    );
    try {
      if (Object.keys(updatedSettings).length > 0) {
        for (const [key, value] of Object.entries(updatedSettings)) {
          await putUpdateNoti({
            enabled: value as boolean,
            target: key as TargetOption,
          });
        }
      }
    } catch (error) {
      checkErrorAndViewToast(error);
    }
  };

  return (
    <SafeAreaView>
      <MyHeader title={'알림 설정'} onPressBack={applySettings} />
      <View style={{ padding: 5 }}>
        <ToggleItem
          label={'전체 푸시 알림'}
          onToggle={() => handleToggle('ALL')}
          isOn={settings.ALL}
        />
        <ToggleItem
          label={'내 위치 주변 SOS 요청 알림'}
          onToggle={() => handleToggle('FOUND_ITEM')}
          isOn={settings.FOUND_ITEM}
        />
        <ToggleItem
          label={'내 위치 주변 분실물 습득 알림'}
          onToggle={() => handleToggle('LOST_ITEM')}
          isOn={settings.LOST_ITEM}
        />
        <ToggleItem
          label={'댓글 알림'}
          onToggle={() => handleToggle('COMMENT')}
          isOn={settings.COMMENT}
        />
        <CustomText style={{ padding: 15, color: colors.GRAY_600 }}>
          ※ 알림을 비활성화해도 목록에는 표시되며 푸시 알림만 차단됩니다.
        </CustomText>
      </View>
    </SafeAreaView>
  );
};

export default MyNotiScreen;
