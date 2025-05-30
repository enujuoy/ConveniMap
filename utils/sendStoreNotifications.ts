import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import en from '../locales/en.json';
import ja from '../locales/ja.json';
import ko from '../locales/ko.json';
import { StoreWithDetails } from '../types';

export async function sendStoreNotification(store: StoreWithDetails) {
  try {
    const storedLang = await AsyncStorage.getItem('userLang');
    const languageCode = storedLang || 'ja';

    if (!i18n.isInitialized) {
      await i18n.init({
        compatibilityJSON: 'v4',
        lng: languageCode,
        fallbackLng: 'ja',
        resources: {
          en: { translation: en },
          ja: { translation: ja },
          ko: { translation: ko },
        },
        interpolation: { escapeValue: false },
      });
    } else {
      await i18n.changeLanguage(languageCode);
    }

    const title = i18n.t(`categories.${store.category}`);
    const body = i18n.t('push.body', { storeName: store.name });

    // ✅ 알림 전송 (채널 ID는 지정하지 않음)
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true, // 소리 켜고 싶으면 true, 끄고 싶으면 null
      },
      trigger: null,
    });
  } catch (err) {
    console.error('❌ 푸시 알림 전송 실패:', err);
  }
}
