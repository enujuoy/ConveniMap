// App.tsx
import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { initI18n } from './i18n';
import AppContent from './AppContent';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        console.log('🟡 i18n 초기화 시작');
        await SplashScreen.preventAutoHideAsync();
        await initI18n();
      } catch (e) {
        console.warn('🚨 i18n 초기화 실패:', e);
      } finally {
        setAppIsReady(true);
      }
    };
    prepare();
  }, []);

  if (!appIsReady) return null;

  return <AppContent />;
}
