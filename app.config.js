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

      ]
    ],
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      
    },

  }
};
