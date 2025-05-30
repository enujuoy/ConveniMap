// utils/getNearbyStores.ts

import Constants from 'expo-constants';
import { StoreWithDetails } from '../types'; // ✅ 여기!
import haversine from 'haversine-distance';
import i18n from '../i18n';

const typeMap = {
  convenience: 'convenience_store',
  drugstore: 'drugstore',
  mart: 'supermarket',
} as const;

export const getNearbyStores = async (
  lat: number,
  lon: number,
  radius: number,
  categories: (keyof typeof typeMap)[],
  openNowOnly: boolean = false
): Promise<StoreWithDetails[]> => {
  const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
  const lang = i18n.language || 'ja';
  const openParam = openNowOnly ? '&opennow=true' : '';

  const userLocation = { latitude: lat, longitude: lon };
  const results: StoreWithDetails[] = [];

  for (const categoryKey of categories) {
    const type = typeMap[categoryKey];
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&language=${lang}${openParam}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const json = await response.json();

      if (!json.results) continue;

      const stores: StoreWithDetails[] = json.results
        .filter((p: any) => p.geometry?.location)
        .map((p: any) => {
          const storeLat = p.geometry.location.lat;
          const storeLon = p.geometry.location.lng;
          const storeLocation = { latitude: storeLat, longitude: storeLon };
          const distance = haversine(userLocation, storeLocation);

          return {
            placeId: p.place_id,
            name: p.name,
            address: p.vicinity,
            latitude: storeLat,
            longitude: storeLon,
            distance,
            category: categoryKey, // ✅ 명확하게 포함
          };
        });

      results.push(...stores);
    } catch (err) {
      console.warn(`⚠️ Failed to fetch stores for category "${categoryKey}":`, err);
    }
  }

  return results;
};
