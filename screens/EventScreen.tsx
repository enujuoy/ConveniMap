// screens/EventScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../components/BottomTab';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

type EventScreenNavProp = StackNavigationProp<HomeStackParamList, 'Event'>;

export default function EventScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const navigation = useNavigation<EventScreenNavProp>();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt ? data.createdAt.toDate() : null;
          return { ...data, createdAt };
        });
        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Header />

        <Text style={styles.title}>海老名 SA</Text>

        <Image source={require('../assets/main.jpg')} style={styles.mainImage} />

        <View style={styles.categoryRow}>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>EVENTS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.categoryButton}
            onPress={() => navigation.navigate('ServiceAreaInfoScreen')}
          >
            <Text style={styles.categoryText}>店舗</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>情報</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>イベント</Text>

        {events.map((event, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate('EventDetail', {
                title: event.title || 'イベント',
                image: require('../assets/event1.jpg'), // 임시 이미지
                description: event.description,
                date: event.date || '日付未設定',
              })
            }
          >
            <View style={styles.eventCard}>
              <Image source={require('../assets/event1.jpg')} style={styles.image} />
              <Text style={styles.eventTitle}>{event.title || 'イベント'}</Text>
              <Text style={styles.eventDescription}>{event.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EventDetail', {
              title: '夜市フェスティバル',
              image: require('../assets/event2.jpg'),
              description: '夜のマーケットでグルメとショッピングを満喫！',
              date: '2025.06.01〜2025.06.10',
            })
          }
        >
          <View style={styles.eventCard}>
            <Image source={require('../assets/event2.jpg')} style={styles.image} />
            <Text style={styles.eventTitle}>夜市フェスティバル</Text>
            <Text style={styles.eventDescription}>
              夜のマーケットでグルメとショッピングを満喫！
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 16 },
  eventCard: { marginBottom: 24 },
  image: { width: '100%', height: 200, borderRadius: 8 },
  eventTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  eventDescription: { fontSize: 14, color: '#666', marginTop: 4 },
  mainImage: { width: '100%', height: 200, resizeMode: 'cover' },
  categoryText: { fontSize: 14 },
  categoryButton: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
});