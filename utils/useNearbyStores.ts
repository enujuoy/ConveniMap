// utils/useNearbyStores.ts

import { useState, useRef } from 'react';
import { getNearbyStores } from './getNearbyStores';
import { StoreWithDetails } from '../types';
import { CategoryKey } from './constants';
import { sendStoreNotification } from './sendStoreNotifications';

export default function useNearbyStores(
  lat: number,
  lon: number,
  radius: number,
  selectedCategories: CategoryKey[],
  openNowOnly: boolean,
  allowNotification: boolean,
  onFoundClosestStore?: (closest: Partial<Record<CategoryKey, StoreWithDetails>>) => void
) {
  const [stores, setStores] = useState<StoreWithDetails[]>([]);
  const alreadyNotifiedCategory = useRef<Set<CategoryKey>>(new Set());

  const fetchStores = async () => {
    const results = await getNearbyStores(lat, lon, radius, selectedCategories, openNowOnly);
    setStores(results);

    const closestMap: Partial<Record<CategoryKey, StoreWithDetails>> = {};
    for (const category of selectedCategories) {
      const filtered = results.filter((s) => s.category === category);
      if (filtered.length > 0) {
        filtered.sort((a, b) => a.distance - b.distance);
        closestMap[category] = filtered[0];
      }
    }

    if (onFoundClosestStore) {
      onFoundClosestStore(closestMap);
    }

    if (allowNotification) {
      for (const [category, store] of Object.entries(closestMap)) {
        const key = category as CategoryKey;
        if (!alreadyNotifiedCategory.current.has(key)) {
          alreadyNotifiedCategory.current.add(key);
          sendStoreNotification(store!);
        }
      }
    }
  };

  return { stores, fetchStores };
}
