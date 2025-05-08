export type ServiceArea = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type NearbyStore = {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type StoreWithDetails = NearbyStore & {
  description: string;
  amenities?: string[];
  menu?: string[];
  storeCode?: string; // ✅ 수정 (serviceAreaCode 아님)
};

export type UserPreferences = {
  selectedAmenities: string[];
  selectedMenus: string[];
};

export type StoreEvent = {
  title: string;
  description: string;
  image?: string | null;
  date: any;
};
