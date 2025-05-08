import Constants from 'expo-constants';

export const getNearbyStores = async (lat: number, lon: number, radius: number = 1000) => {
  const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=convenience_store&language=ja&key=${apiKey}`;
  const response = await fetch(url);
  const json = await response.json();

  if (!json.results) return [];

  return json.results
    .filter((place: any) => place.geometry?.location?.lat && place.geometry?.location?.lng)
    .map((place: any) => ({
      placeId: place.place_id,
      name: place.name,
      address: place.vicinity,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    }));
};
