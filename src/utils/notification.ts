import { AppState } from 'react-native';
import notifee, {
  AndroidImportance,
  AndroidColor,
  EventType,
  Notification,
  NotificationPressAction,
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

type CustomNotificationEvent = {
  type: EventType;
  detail: {
    notification?: Notification;
    pressAction?: NotificationPressAction;
  };
};

const handleNotificationEvent = async ({
  type,
  detail,
}: CustomNotificationEvent) => {
  console.log({ type, detail });
  if (type === EventType.PRESS) {
    console.log('press');
    const { title, body } = detail.notification?.data || {};
    console.log({ title, body });
    if (title === 'routeSaved' || title === 'route') {
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
};
notifee.onForegroundEvent(handleNotificationEvent);
notifee.onBackgroundEvent(handleNotificationEvent);
