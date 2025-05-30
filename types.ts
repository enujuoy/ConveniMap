import { CategoryKey } from './utils/constants';

export interface NearbyStore {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number; // ✅ 거리 정보 추가
}

export interface StoreWithDetails extends NearbyStore {
  description?: string;
  amenities?: string[];
  menu?: string[];
  category: CategoryKey; // ✅ 카테고리 필드 추가 (convenience | drugstore | mart)
}
