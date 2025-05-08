import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { StoreWithDetails } from '../types';

type MapProps = {
  myLat: number;
  myLon: number;
  serviceAreas: StoreWithDetails[]; // ✅ 여기!! ServiceArea[] → StoreWithDetails[]
  mapRef: React.RefObject<MapView>;
};

export default function Map({ myLat, myLon, serviceAreas, mapRef }: MapProps) {
  const region: Region = {
    latitude: myLat,
    longitude: myLon,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  // 현재 위치 및 마커들을 포함해 화면에 맞춰줌
  const handleMapReady = () => {
    if (mapRef.current) {
      const points = [
        { latitude: myLat, longitude: myLon },
        ...serviceAreas.map(store => ({
          latitude: store.latitude,
          longitude: store.longitude,
        })),
      ];

      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [region]);

  return (
    <MapView
      ref={mapRef}
      provider="google"
      style={styles.map}
      region={region} // region 사용 (초기 위치 유지)
      onMapReady={handleMapReady}
    >
      <Marker
        coordinate={{ latitude: myLat, longitude: myLon }}
        title="現在地"
        pinColor="red"
      />
      {serviceAreas.map((store, idx) => (
        <Marker
          key={idx}
          coordinate={{ latitude: store.latitude, longitude: store.longitude }}
          title={store.name}
          description={store.address}
          pinColor="green"
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1, // ✅ 화면 전체를 채우도록 설정
  },
});
