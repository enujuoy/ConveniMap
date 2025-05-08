// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTab from './components/BottomTab';
import CategorySettingScreen from './screens/CategorySettingScreen';
import MapScreen from './screens/MapScreen';
import StoreDetailsScreen from './screens/StoreDetailsScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import * as Notifications from 'expo-notifications';

export type RootStackParamList = {
  MainTabs: undefined;
  CategorySetting: undefined;
  Map: undefined;
  StoreDetails: {
    storeCode: string;
    areaName: string;
  };
  EventDetail: {
    title: string;
    description: string;
    image?: string;
    date?: any;
  };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={BottomTab} />
        <RootStack.Screen name="CategorySetting" component={CategorySettingScreen} />
        <RootStack.Screen name="Map" component={MapScreen} />
        <RootStack.Screen name="StoreDetails" component={StoreDetailsScreen} />
        <RootStack.Screen name="EventDetail" component={EventDetailScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
