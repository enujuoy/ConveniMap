// ✅ MapWithInputs.tsx (거리 Picker 제거 후 전체 코드)
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { StoreWithDetails } from '../types';
import { CategoryKey } from '../utils/constants';

export interface MapWithInputsProps {
  location: { latitude: number; longitude: number };
  radius: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
  stores: StoreWithDetails[];
  mapRef: React.RefObject<MapView>;
}

export default function MapWithInputs({
  location,
  radius,
  setRadius,
  stores,
  mapRef,
}: MapWithInputsProps) {
  const region: Region = useMemo(
    () => ({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    [location]
  );

  const getColorForCategory = (category: CategoryKey) => {
    switch (category) {
      case 'convenience': return 'green';
      case 'drugstore': return 'blue';
      case 'mart': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        region={region}
        showsUserLocation
      >
        {stores.map((store, idx) => (
          <Marker
            key={`${store.name}_${store.latitude}_${store.longitude}`}
            coordinate={{ latitude: store.latitude, longitude: store.longitude }}
            title={store.name}
            description={store.address}
            pinColor={getColorForCategory(store.category)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
