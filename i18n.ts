import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';

export const initI18n = async () => {
  const systemLang = Localization.locale.split('-')[0]; // ex: ja-JP → ja
  const userLang = await AsyncStorage.getItem('userLang');
  const hasUserSetLang = await AsyncStorage.getItem('hasUserSetLang'); // ✅ 사용자 언어 수동 설정 여부

  const languageCode =
    hasUserSetLang === 'true' && userLang ? userLang : systemLang;

  console.log('🟡 userLang:', userLang);
  console.log('🟣 hasUserSetLang:', hasUserSetLang);
  console.log('🟢 systemLang:', systemLang);
  console.log('🌐 최종 적용 언어:', languageCode);

  await i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v4',
      lng: languageCode,
      fallbackLng: 'ja', // 미지원 언어 시 fallback
      resources: {
        en: { translation: en },
        ja: { translation: ja },
        ko: { translation: ko },
      },
      interpolation: {
        escapeValue: false,
      },
    });

  console.log('✅ i18n 초기화 완료');
};

export default i18n;
