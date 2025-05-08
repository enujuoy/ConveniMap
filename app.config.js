// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: "ConveniPj",
    slug: "ConveniPj",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    android: {
      package: "com.anonymous.ConveniPj",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      },
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    ios: {
      supportsTablet: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: "b727836e-2249-4a35-9fa4-84b4dce8b9a5"
      }
    },
    owner: "enujuoy"
  }
}
