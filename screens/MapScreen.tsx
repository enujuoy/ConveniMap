import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import haversine from 'haversine-distance';

import useNearbyStores from '../utils/useNearbyStores';
import MapWithInputs from '../components/MapWithInputs';
import CategorySelector from '../components/CategorySelector';
import SettingButton from '../components/SettingButton';
import DistanceSettingSheet from '../components/DistanceSettingSheet';
import CustomDirectionsButton from '../components/CustomDirectionsButton';
import { CategoryKey } from '../utils/constants';
import { useTranslation } from 'react-i18next';
import { StoreWithDetails } from '../types';

export default function MapScreen() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [radius, setRadius] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>(['convenience']);
  const openNowOnly = true; // ✅ 기본값 고정 및 UI에서 제거
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [allowNotification, setAllowNotification] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [userClickedStoreId, setUserClickedStoreId] = useState<string | null>(null);
  const [selectedStores, setSelectedStores] = useState<Partial<Record<CategoryKey, StoreWithDetails>>>({});
  const [renderStore, setRenderStore] = useState<StoreWithDetails | null>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const mapRef = useRef<any>(null);
  const fadeOverlay = useRef(new Animated.Value(1)).current;
  const scaleOverlay = useRef(new Animated.Value(1)).current;
  const fadeLoadingText = useRef(new Animated.Value(1)).current;
  const fadeDoneText = useRef(new Animated.Value(0)).current;

  const animatedDirectionOpacity = useRef(new Animated.Value(0)).current;
  const animatedDirectionTranslate = useRef(new Animated.Value(50)).current;

  const getDeltaFromDistance = (distanceKm: number): number => {
    const baseDelta = 0.002;
    const baseDistance = 0.2;
    return baseDelta * (distanceKm / baseDistance) * 1.8;
  };

  const focusOnClosestStores = (closestMap: Partial<Record<CategoryKey, StoreWithDetails>>) => {
    if (!mapRef.current || !location) return;

    const userCoord = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const closestStores = Object.values(closestMap);
    if (closestStores.length === 0) return;

    const farthestDistance = Math.max(
      ...closestStores.map((store) => haversine(userCoord, store) / 1000)
    );

    const delta = Math.max(getDeltaFromDistance(farthestDistance), 0.002);

    mapRef.current.animateToRegion(
      {
        latitude: userCoord.latitude,
        longitude: userCoord.longitude,
        latitudeDelta: delta,
        longitudeDelta: delta,
      },
      1000
    );
  };

  const { stores, fetchStores } = useNearbyStores(
    location?.latitude ?? 0,
    location?.longitude ?? 0,
    radius,
    selectedCategories,
    openNowOnly,
    allowNotification,
    (closestMap) => {
      setSelectedStores(closestMap);
      const firstCategory = selectedCategories[0];
      if (closestMap[firstCategory]) {
        setSelectedStoreId(closestMap[firstCategory].placeId);
      }
      focusOnClosestStores(closestMap);
    }
  );

  const selectedStore = stores.find((s) => s.placeId === selectedStoreId);

  useEffect(() => {
    if (selectedStore && !showOverlay) {
      setRenderStore(selectedStore);
      Animated.parallel([
        Animated.timing(animatedDirectionOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animatedDirectionTranslate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedDirectionOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animatedDirectionTranslate, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setRenderStore(null));
    }
  }, [selectedStore, showOverlay]);

  useEffect(() => {
    const startTime = Date.now();
    const loadLocation = async () => {
      const status = await Location.requestForegroundPermissionsAsync();
      if (status.status !== 'granted') {
        alert(t('notifications.permissionRequired'));
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(3000 - elapsed, 0);

      setTimeout(() => {
        animateTextCrossfade();
        setTimeout(() => {
          animateOverlayExit();
        }, 2000);
      }, remaining);
    };

    loadLocation();
  }, []);

  useEffect(() => {
    if (location) fetchStores();
  }, [location, radius, selectedCategories]);

  useFocusEffect(
    useCallback(() => {
      if (location) fetchStores();
    }, [location])
  );

  const animateTextCrossfade = () => {
    Animated.parallel([
      Animated.timing(fadeLoadingText, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeDoneText, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOverlayExit = () => {
    Animated.parallel([
      Animated.timing(fadeOverlay, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleOverlay, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowOverlay(false);
      if (location) fetchStores();
    });
  };

  const goToMyLocation = async () => {
    if (!location || !mapRef.current) return;
    mapRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.adBanner}>
        <BannerAd
          unitId={TestIds.BANNER}
          size={BannerAdSize.ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>

      <View style={styles.contentWrapper}>
        {location && (
          <>
            <CategorySelector
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}

            />
            <View style={styles.mapContainer}>
              <MapWithInputs
                location={location}
                radius={radius}
                setRadius={setRadius}
                stores={stores}
                mapRef={mapRef}
                onMapReady={() => {}}
                selectedStores={selectedStores}
                selectedStoreId={selectedStoreId}
                setSelectedStoreId={setSelectedStoreId}
                userClickedStoreId={userClickedStoreId}
                setUserClickedStoreId={setUserClickedStoreId}
              />
            </View>

            <Animated.View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 3,
                opacity: animatedDirectionOpacity,
                transform: [{ translateX: animatedDirectionTranslate }],
                zIndex: 10,
              }}
            >
              {renderStore && !showOverlay && (
                <CustomDirectionsButton
                  destinationLat={renderStore.latitude}
                  destinationLon={renderStore.longitude}
                />
              )}
            </Animated.View>

            <SettingButton onPress={() => setIsSettingOpen(true)} />

            <TouchableOpacity style={styles.myLocationButton} onPress={goToMyLocation}>
              <Ionicons name="navigate" size={20} color="#333" />
              <Text style={{ marginLeft: 6, color: '#333', fontSize: 14 }}>
                {t('map.myLocation')}
              </Text>
            </TouchableOpacity>

            <DistanceSettingSheet
              isVisible={isSettingOpen}
              onClose={() => setIsSettingOpen(false)}
              radius={radius}
              setRadius={setRadius}
              allowNotification={allowNotification}
              setAllowNotification={setAllowNotification}
            />
          </>
        )}
      </View>

      {showOverlay && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: fadeOverlay,
              transform: [{ scale: scaleOverlay }],
            },
          ]}
        >
          <Image source={require('../assets/Logo.png')} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.title}>{t('appTitle')}</Text>
          <View style={styles.loadingContent}>
            <Animated.View style={{ opacity: fadeLoadingText, position: 'absolute' }}>
              <ActivityIndicator size="large" color="#333" />
              <Text style={styles.loadingText}>{t('map.loading')}</Text>
            </Animated.View>
            <Animated.View style={{ opacity: fadeDoneText, position: 'absolute' }}>
              <Text style={styles.completionText}>{t('map.loadingDone')}</Text>
            </Animated.View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  adBanner: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#eee',
  },
  overlay: {
    position: 'absolute',
    backgroundColor: '#fff',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  loadingContent: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  completionText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 18,
    left: 3,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    zIndex: 10,
  },
});
