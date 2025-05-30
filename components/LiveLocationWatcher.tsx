import { useEffect } from 'react';
import * as Location from 'expo-location';

interface Props {
  onLocationUpdate: (location: { latitude: number; longitude: number }) => void;
}

export default function LiveLocationWatcher({ onLocationUpdate }: Props) {
  useEffect(() => {
    let subscription: Location.LocationSubscription;

    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // 5초 간격
          distanceInterval: 10, // 10미터 이동 시
        },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          onLocationUpdate({ latitude, longitude });
        }
      );
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [onLocationUpdate]);

  return null; // 이 컴포넌트는 UI 요소가 없음
}
