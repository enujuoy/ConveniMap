// useLocationAndPermission.ts
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export default function useLocationAndPermission() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      const notif = await Notifications.requestPermissionsAsync();
      const loc = await Location.requestForegroundPermissionsAsync();

      if (notif.status !== 'granted' || loc.status !== 'granted') {
        alert('位置情報と通知の許可が必要です');
        return;
      }

      const pos = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    })();
  }, []);

  return location;
}
