import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const useNotifications = () => {
  const setup = async () => {
    if (Device.isDevice) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('通知の許可が必要です');
        return;
      }

      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
      });
    } else {
      alert('実機でテストしてください');
    }
  };

  const notify = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: null,
    });
  };

  return { setup, notify };
};
