import 'dotenv/config';

export default {
  expo: {
    name: 'CornershopMap',
    slug: 'ConveniPj',
    version: '1.1.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/adaptive-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    
    ios: {
      supportsTablet: true,
    },
    android: {
      package: 'com.Devfox.ConveniPj',
      versionCode: 2,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-localization',
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: 'ca-app-pub-3128843138562956~2856950789',        }
      ]
    ],
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: 'd7c229fd-dd89-4e5f-8e56-7ff4c3289f79',
      },
    },
    owner: 'syjaa',
  }
};
