import * as Notifications from 'expo-notifications';
import { CategoryKey } from './constants';

const categoryLabels: Record<CategoryKey, string> = {
  convenience: 'コンビニ',
  drugstore: 'ドラッグストア',
  mart: 'スーパー',
};

export async function notifyNearbyStore({
  name,
  address,
  category,
}: {
  name: string;
  address: string;
  category: CategoryKey;
}) {
  const label = categoryLabels[category];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `[${label}] 近くに ${name} があります`,
      body: `住所: ${address}`,
      sound: 'default',
    },
    trigger: null,
  });
}
