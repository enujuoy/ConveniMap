// screens/EventDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

const { width } = Dimensions.get('window');

type EventDetailRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

export default function EventDetailScreen() {
  const { title, description, image, date } = useRoute<EventDetailRouteProp>().params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{title}</Text>

        {/* 이미지가 있을 때만 표시 */}
        {image && (
          <Image
            source={typeof image === 'string' ? { uri: image } : image}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {/* 날짜 */}
        <Text style={styles.date}>{date ? new Date(date.seconds * 1000).toLocaleString() : ''}</Text>

        {/* 설명 */}
        <Text style={styles.description}>{description}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 80,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  image: {
    width: width - 40,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
});
