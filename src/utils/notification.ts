import { AppState } from 'react-native';
import notifee, {
  AndroidImportance,
  AndroidColor,
  EventType,
} from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { triggerModal } from '../../App';
import { NotiBodyMessages, NotiTitleMessages } from '@/constants';

export const displayNotification = async (
  message: FirebaseMessagingTypes.RemoteMessage,
) => {
  const title: string = message.notification?.title ?? '';
  const body: string = message.notification?.body ?? '';
  const channelAnoucement = await notifee.createChannel({
    id: 'default',
    name: 'dandi',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: NotiTitleMessages[title],
    body: NotiBodyMessages[title],
    android: {
      channelId: channelAnoucement,
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
      actions: [
        {
          title: '건너뛰기',
          pressAction: { id: 'skip' },
        },
      ],
    },
    data: {
      title,
      body,
    },
  });
};

notifee.onForegroundEvent(async ({ type, detail }) => {
  console.error('type', type, 'detail', detail);
  if (type === EventType.PRESS) {
    console.error('press');
    const { title, body } = detail.notification?.data || {};
    if (title === 'routeSaved') {
      if (triggerModal) {
        console.log('trigger');
        triggerModal(body as string);
      }
    }
  } else if (
    type === EventType.ACTION_PRESS &&
    detail.pressAction?.id === 'skip'
  ) {
    console.error('skip');
    if (detail.notification?.id) {
      await notifee.cancelNotification(detail.notification.id);
    }
  }
});
