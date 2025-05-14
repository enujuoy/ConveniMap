import { useState, useRef } from 'react';
import { getNearbyStores } from './getNearbyStores';
import { StoreWithDetails } from '../types';
import { categoryMap, CategoryKey } from './constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { scheduleChannelCleanup } from './notificationChannelManager';

export default function useNearbyStores(
  lat: number,
  lon: number,
  radius: number,
  selectedCategories: CategoryKey[],
  openNowOnly: boolean,
  allowNotification: boolean,
  allowSound: boolean,
  allowVibration: boolean,
  channelId: string | null // ✅ 새 파라미터
) {
  const [stores, setStores] = useState<StoreWithDetails[]>([]);
  const alreadyNotifiedCategory = useRef<Set<CategoryKey>>(new Set());

  const fetchStores = async () => {
    if ((lat === 0 && lon === 0) || selectedCategories.length === 0) {
      setStores([]);
      return;
    }

    const results: StoreWithDetails[] = [];

    for (const cat of selectedCategories) {
      const label = categoryMap[cat];
      const storesByCat = await getNearbyStores(lat, lon, radius, label, openNowOnly);

      const detailed = storesByCat.map((s) => ({
        ...s,
        category: cat,
        description: '',
        amenities: [],
        menu: [],
      }));

      results.push(...detailed);

      if (
        allowNotification &&
        detailed.length > 0 &&
        !alreadyNotifiedCategory.current.has(cat)
      ) {
        const closest = detailed[0];
        alreadyNotifiedCategory.current.add(cat);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `[${label}] 近くに ${closest.name} があります`,
            body: `住所: ${closest.address}`,
            ...(Platform.OS === 'ios'
              ? { sound: allowSound ? true : false }
              : { sound: allowSound ? 'default' : 'silent' }),
          },
          trigger: null,
          ...(Platform.OS === 'android' && channelId
            ? { android: { channelId } }
            : {}),
        });
      }
    }

    alreadyNotifiedCategory.current.forEach((cat) => {
      if (!selectedCategories.includes(cat)) {
        alreadyNotifiedCategory.current.delete(cat);
      }
    });

    scheduleChannelCleanup(); // 채널 삭제 예약
    setStores(results);
  };

  return { stores, fetchStores };
}
