import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EventStackParamList } from './BottomTab'; // 타입 정의 경로에 맞게 수정
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';

const sliderWidth = Dimensions.get('window').width;
const itemWidth = sliderWidth * 0.9;

const imageMap: { [key: string]: any } = {
  event1: require('../assets/event1.jpg'),
  event2: require('../assets/event2.jpg'),
  event3: require('../assets/event3.jpg'),
};

type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  image: any;
};

const EventSlider = () => {
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);
  const navigation = useNavigation<StackNavigationProp<EventStackParamList, 'Event'>>();
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'events'));
        const fetched: EventItem[] = snapshot.docs.map(doc => {
          const data = doc.data();
          let date = '';
          try {
            const start = data.startDate?.toDate();
            const end = data.endDate?.toDate();
            date = `${format(start, 'yyyy.MM.dd')}～${format(end, 'yyyy.MM.dd')}`;
          } catch (e) {
            console.warn('날짜 포맷 오류', e);
          }

          const imageKey = data.imageKey || 'event1';

          return {
            id: doc.id,
            title: data.title || 'タイトルなし',
            description: data.description || '',
            date,
            image: imageMap[imageKey] || imageMap['event1'],
          };
        });

        setEvents(fetched);
      } catch (err) {
        console.error('이벤트 로딩 실패:', err);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (events.length === 0) return;
      currentIndex.current = (currentIndex.current + 1) % events.length;
      flatListRef.current?.scrollToIndex({ index: currentIndex.current, animated: true });
    }, 4000);
    return () => clearInterval(interval);
  }, [events]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EventDetail', {
                title: item.title,
                image: item.image,
                description: item.description,
                date: item.date,
              })
            }
          >
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={true}
      />
    </View>
  );
};

export default EventSlider;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  image: {
    width: itemWidth,
    height: 160,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  title: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
