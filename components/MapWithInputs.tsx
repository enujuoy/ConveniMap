import React, { useRef } from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { ComponentRef } from 'react';
import { StoreWithDetails } from '../types';
import { CategoryKey } from '../utils/constants';

interface Props {
  location: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  setRadius: (value: number) => void;
  stores: StoreWithDetails[];
  mapRef: React.RefObject<MapView>;
  onMapReady: () => void;
  selectedStores: Partial<Record<CategoryKey, StoreWithDetails>>;
  selectedStoreId: string | null;
  setSelectedStoreId: (id: string) => void;
  userClickedStoreId: string | null;
  setUserClickedStoreId: (id: string | null) => void;
}

const markerImages: { [key in CategoryKey]?: any } = {
  convenience: require('../assets/Conveni_pin_red.png'),
  drugstore: require('../assets/Pharmacy_pin.png'),
  mart: require('../assets/Mart_pin.png'),
};

const fallbackMarker = require('../assets/Fallback_pin.png');

export default function MapWithInputs({
  location,
  radius,
  setRadius,
  stores,
  mapRef,
  onMapReady,
  selectedStores,
  selectedStoreId,
  setSelectedStoreId,
  userClickedStoreId,
  setUserClickedStoreId,
}: Props) {
  if (!location) return <View style={styles.fallback} />;

  const markerRefs = useRef<Record<string, ComponentRef<typeof Marker> | null>>({});

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onMapReady={onMapReady}
      >
        {stores.map((store) => {
          const isClosest =
            selectedStores[store.category]?.placeId === store.placeId;

          const markerImage = markerImages[store.category] || fallbackMarker;
          const size = isClosest ? 48 : 30;

          return (
            <Marker
              key={store.placeId}
              ref={(ref) => {
                markerRefs.current[store.placeId] = ref;
              }}
              coordinate={{
                latitude: store.latitude,
                longitude: store.longitude,
              }}
              title={store.name}
              anchor={{ x: 0.5, y: 1 }} // 아래 잘림 방지
              calloutAnchor={{ x: 0.5, y: 0 }}
              onPress={() => {
                setSelectedStoreId(store.placeId);
                setUserClickedStoreId(store.placeId);
              }}
              onLayout={() => {
                if (isClosest) {
                  setTimeout(() => {
                    markerRefs.current[store.placeId]?.showCallout();
                  }, 0);
                }
              }}
            >
              <View
                style={{
                  width: size,
                  height: size,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={markerImage}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
});
