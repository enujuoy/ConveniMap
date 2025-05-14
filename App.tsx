// App.tsx
import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { navigationRef } from './utils/navigationRef';

import MapScreen from './screens/MapScreen';

export type RootStackParamList = {
  Map: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ✅ 알림 처리 핸들러 설정 (필수)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    // ✅ 알림 권한 요청 및 토큰 확인
    const registerForPush = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('通知の許可が必要です');
        return;
      }

      if (Device.isDevice) {
        const token = await Notifications.getExpoPushTokenAsync();
        console.log('Expo Push Token:', token.data);
      } else {
        console.warn('⚠️ シミュレーターでは通知は表示されません');
      }
    };

    registerForPush();

    // ✅ 알림 클릭 이벤트 수신
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('🔔 通知クリック:', data);
      // 필요 시 navigationRef 사용해 화면 전환 가능
    });

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
