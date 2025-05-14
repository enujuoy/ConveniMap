// ✅ getNearbyStores.ts
import Constants from 'expo-constants';
import { NearbyStore } from '../types';

const typeMap = {
  コンビニ: 'convenience_store',
  ドラッグストア: 'pharmacy',
  スーパー: 'supermarket',
} as const;

export const getNearbyStores = async (
  lat: number,
  lon: number,
  radius: number,
  categoryLabel: keyof typeof typeMap,
  openNowOnly: boolean = false
): Promise<NearbyStore[]> => {
  const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
  const type = typeMap[categoryLabel];
  const openParam = openNowOnly ? '&opennow=true' : '';
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&language=ja${openParam}&key=${apiKey}`;

  const response = await fetch(url);
  const json = await response.json();
  if (!json.results) return [];

  return json.results
    .filter((p: any) => p.geometry?.location)
    .map((p: any) => ({
      placeId: p.place_id,
      name: p.name,
      address: p.vicinity,
      latitude: p.geometry.location.lat,
      longitude: p.geometry.location.lng,
    }));
};