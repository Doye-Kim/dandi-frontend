import React, { useEffect } from 'react';
import notifee, {
  AndroidImportance,
  EventType,
  Notification,
  NotificationPressAction,
} from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { triggerModal } from '../../App';
import { NotiBodyMessages, NotiTitleMessages } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPostByCommentId } from '@/api/lost';
import { isAxiosError } from 'axios';
import { navigationRef } from '../../App';
import { lostNavigations } from '@/constants';

// 댓글 알림 클릭 시 해당 게시글로 이동
const goToDetail = async (commentId: number, type: string | undefined) => {
  if (!navigationRef.isReady()) {
    console.warn('Navigation is not ready');
    return;
  }

  try {
    if (!commentId || !type) {
      throw new Error('Invalid commentId or type');
    }
    const data = await getPostByCommentId(commentId, type);
    if (type === 'foundComment') {
      navigationRef.navigate('LostStackNavigator', {
        screen: lostNavigations.PICKUP_DETAIL,
        params: { id: data.itemId },
      });
    } else if (type === 'lostComment') {
      navigationRef.navigate('LostStackNavigator', {
        screen: lostNavigations.SOS_DETAIL,
        params: { id: data.itemId },
      });
    }
  } catch (error) {
    console.error('getPostByCommentId 실패:', error);
    if (isAxiosError(error)) {
      if (type === 'foundComment') {
        navigationRef.navigate('LostStackNavigator', {
          screen: lostNavigations.PICKUP_LIST,
        });
      } else if (type === 'lostComment') {
        navigationRef.navigate('LostStackNavigator', {
          screen: lostNavigations.SOS_LIST,
        });
      }
    }
  }
};

export const displayNotification = async (
  message: FirebaseMessagingTypes.RemoteMessage,
) => {
  const title: string = message.notification?.title ?? '';
  const body: string = message.notification?.body ?? '';
  if (title === 'route' && body) {
    AsyncStorage.setItem('routeId', JSON.stringify(JSON.parse(body).routeId));
  }
  const channelAnoucement = await notifee.createChannel({
    id: 'default',
    name: 'dandi',
    importance: AndroidImportance.HIGH,
  });

  const actions =
    title === 'route'
      ? [
          {
            title: '건너뛰기',
            pressAction: { id: 'skip' },
          },
        ]
      : undefined;
  await notifee.displayNotification({
    title: NotiTitleMessages[title] || title,
    body: NotiBodyMessages[title] || body,
    android: {
      channelId: channelAnoucement,
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
      actions,
    },
    data: {
      title,
      body,
    },
  });
};

export const NotificationHandler = () => {
  useEffect(() => {
    const handleNotificationEvent = async ({
      type,
      detail,
    }: {
      type: EventType;
      detail: {
        notification?: Notification;
        pressAction?: NotificationPressAction;
      };
    }) => {
      const { title, body } = detail.notification?.data || {};
      if (type === EventType.PRESS) {
        console.log(title, body);
        const { resourceId, eventType } = JSON.parse(body as string);

        if (title === 'route') {
          if (triggerModal && body) triggerModal(body as string);
        } else if (title === 'foundComment' || title === 'lostComment') {
          goToDetail(resourceId, eventType);
        } else if (title === 'foundItem') {
          navigationRef.navigate('LostStackNavigator', {
            screen: lostNavigations.PICKUP_DETAIL,
            params: { id: resourceId },
          });
        } else if (title === 'lostItem') {
          navigationRef.navigate('LostStackNavigator', {
            screen: lostNavigations.SOS_DETAIL,
            params: { id: resourceId },
          });
        }
      } else if (
        type === EventType.ACTION_PRESS &&
        detail.pressAction?.id === 'skip'
      ) {
        if (detail.notification?.id) {
          await notifee.cancelNotification(detail.notification.id);
        }
      }
    };

    const unsubscribeForeground = notifee.onForegroundEvent(
      handleNotificationEvent,
    );
    // const unsubscribeBackground = notifee.onBackgroundEvent(
    //   handleNotificationEvent,
    // );

    let unsubscribeBackground: (() => void) | undefined;
    try {
      unsubscribeBackground = notifee.onBackgroundEvent(
        handleNotificationEvent,
      );
      console.log('onBackgroundEvent initialized:', !!unsubscribeBackground);
    } catch (error) {
      console.error('Error initializing onBackgroundEvent:', error);
    }

    return () => {
      unsubscribeForeground();
      if (unsubscribeBackground) {
        unsubscribeBackground();
      }
    };
  }, []);

  return null;
};
