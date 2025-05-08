import * as Notifications from 'expo-notifications';

export const notifyNearbyStores = async (stores: any[]) => {
  for (let i = 0; i < Math.min(stores.length, 3); i++) {
    const store = stores[i];
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `近くのコンビニ: ${store.name}`,
        body: `住所: ${store.address}`,
        sound: 'default',
      },
      trigger: null, // 즉시 발송
    });
  }
};
