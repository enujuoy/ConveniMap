import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import MapView from 'react-native-maps';

import useNearbyStores from '../utils/useNearbyStores';
import MapWithInputs from '../components/MapWithInputs';
import CategorySelector from '../components/CategorySelector';
import SettingButton from '../components/SettingButton';
import DistanceSettingSheet from '../components/DistanceSettingSheet';
import { CategoryKey } from '../utils/constants';
import {
  clearAllNotificationChannels,
  getOrCreateChannel,
} from '../utils/notificationChannelManager';

export default function MapScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [radius, setRadius] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>(['convenience']);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [allowNotification, setAllowNotification] = useState(true);
  const [allowSound, setAllowSound] = useState(true);
  const [allowVibration, setAllowVibration] = useState(true);
  const [channelId, setChannelId] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  const { stores, fetchStores } = useNearbyStores(
    location?.latitude ?? 0,
    location?.longitude ?? 0,
    radius,
    selectedCategories,
    openNowOnly,
    allowNotification,
    allowSound,
    allowVibration,
    channelId
  );

  useEffect(() => {
    (async () => {
      const locStatus = await Location.requestForegroundPermissionsAsync();
      if (locStatus.status !== 'granted') {
        alert('位置情報の許可が必要です');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      clearAllNotificationChannels();
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android' && allowNotification) {
      (async () => {
        const id = await getOrCreateChannel(allowSound, allowVibration);
        setChannelId(id);
      })();
    }
  }, [allowSound, allowVibration, allowNotification]);

  useEffect(() => {
    if (location) {
      fetchStores();
    }
  }, [location, radius, selectedCategories, openNowOnly]);

  const sendSilentTestNotification = async () => {
    await Notifications.setNotificationChannelAsync('alert-silent', {
      name: '무음 채널',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'silent',
      enableVibrate: false,
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '무음 테스트',
        body: '소리와 진동 없이 와야 정상입니다',
        sound: 'silent',
        android: {
          channelId: 'alert-silent',
        },
      } as any,
      trigger: null,
    });
    
  };

  if (!location) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>現在地を取得中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.adBanner}>
        <Image source={require('../assets/banner.png')} style={styles.adImage} resizeMode="cover" />
      </View>

      <View style={styles.contentWrapper}>
        <CategorySelector
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          openNowOnly={openNowOnly}
          setOpenNowOnly={setOpenNowOnly}
        />

        <View style={styles.mapContainer}>
          <MapWithInputs
            location={location}
            radius={radius}
            setRadius={setRadius}
            stores={stores}
            mapRef={mapRef}
          />
        </View>
      </View>

      <SettingButton onPress={() => setIsSettingOpen(true)} />

      <DistanceSettingSheet
        isVisible={isSettingOpen}
        onClose={() => {
          setIsSettingOpen(false);
          if (openNowOnly && location) {
            fetchStores();
          }
        }}
        radius={radius}
        setRadius={setRadius}
        allowNotification={allowNotification}
        setAllowNotification={setAllowNotification}
        allowSound={allowSound}
        setAllowSound={setAllowSound}
        allowVibration={allowVibration}
        setAllowVibration={setAllowVibration}
      />

      <TouchableOpacity
        style={{ position: 'absolute', bottom: 120, right: 20, backgroundColor: 'black', padding: 10, borderRadius: 8 }}
        onPress={sendSilentTestNotification}
      >
        <Text style={{ color: 'white' }}>🔔 테스트 알림</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  adBanner: {
    height: 60,
    backgroundColor: '#ccc',
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
  contentWrapper: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
});
