import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import MainScreen from '../screens/MainScreen';
import EventScreen from '../screens/EventScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import MyPageScreen_Market from '../screens/MyPageScreen_Market';
import MyPageScreen_Market_Event from '../screens/MyPageScreen_Market_Event';
import EventUpdateScreen from '../screens/EventUpdateScreen';
import StoreRegisterScreen from '../screens/StoreRegisterScreen';

// 타입 정의
export type HomeStackParamList = {
  Main: undefined;
  Event: undefined;
  EventDetail: {
    title: string;
    image: any;
    description: string;
    date: string;
  };
  ServiceAreaInfoScreen: undefined;
};

export type EventStackParamList = {
  Event: undefined;
  EventDetail: {
    title: string;
    image: any;
    description: string;
    date: string;
  };
};

export type MyPageMarketStackParamList = {
  MyPageTop: undefined;
  EventManagement: undefined;
  EventUpdate: undefined;
  StoreRegister: undefined;
};

// Stack Navigators
const HomeStack = createStackNavigator<HomeStackParamList>();
const EventStack = createStackNavigator<EventStackParamList>();
const MyPageStack = createStackNavigator<MyPageMarketStackParamList>();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Main" component={MainScreen} />
      <HomeStack.Screen name="Event" component={EventScreen} />
      <HomeStack.Screen name="EventDetail" component={EventDetailScreen} />
    </HomeStack.Navigator>
  );
}

function EventStackScreen() {
  return (
    <EventStack.Navigator screenOptions={{ headerShown: false }}>
      <EventStack.Screen name="Event" component={EventScreen} />
      <EventStack.Screen name="EventDetail" component={EventDetailScreen} />
    </EventStack.Navigator>
  );
}

function MyPageMarketStackScreen() {
  return (
    <MyPageStack.Navigator screenOptions={{ headerShown: false }}>
      <MyPageStack.Screen name="MyPageTop" component={MyPageScreen_Market} />
      <MyPageStack.Screen name="EventManagement" component={MyPageScreen_Market_Event} />
      <MyPageStack.Screen name="EventUpdate" component={EventUpdateScreen} />
      <MyPageStack.Screen name="StoreRegister" component={StoreRegisterScreen} />
    </MyPageStack.Navigator>
  );
}

// Bottom Tab
const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'home';
          if (route.name === 'HomeTab') iconName = 'home';
          else if (route.name === 'EventTab') iconName = 'gift';
          else if (route.name === 'MypageTab') iconName = 'person';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ tabBarLabel: 'ホーム' }} />
      <Tab.Screen name="EventTab" component={EventStackScreen} options={{ tabBarLabel: 'イベント' }} />
      <Tab.Screen name="MypageTab" component={MyPageMarketStackScreen} options={{ tabBarLabel: 'マイページ' }} />
    </Tab.Navigator>
  );
}
