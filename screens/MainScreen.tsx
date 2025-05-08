import React from 'react';
import {View,Text,ScrollView,StyleSheet,} from 'react-native';
import Header from '../components/Header';
import CategorySelector from '../components/CategorySelector';
import AreaSelector from '../components/AreaSelector';
import LocationSelector from '../components/LocationSelector';
import EventCarousel from '../components/EventCarousel';
import InfoCarousel from '../components/InfoCarousel';
import MapShortcut from '../components/MapShortcut';

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Header />
        <CategorySelector />
        <MapShortcut/>
        <AreaSelector />
        <LocationSelector />

        <Text style={styles.title}>イベント</Text>
        <EventCarousel />

        <Text style={styles.title}>お役立ち情報</Text>
        <InfoCarousel />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 80, // 하단 탭 공간 확보
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
});