import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyPageMarketStackParamList } from '../components/MyPageMarketStack';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';

type NavProp = StackNavigationProp<MyPageMarketStackParamList, 'EventManagement'>;

type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
};

export default function MyPageScreen_Market_Event() {
  const navigation = useNavigation<NavProp>();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'events'));
      const fetched = snapshot.docs.map(doc => {
        const data = doc.data();
        let date = '';
        try {
          const start = data.startDate?.toDate();
          const end = data.endDate?.toDate();
          date = `${format(start, 'yyyy.MM.dd')}～${format(end, 'yyyy.MM.dd')}`;
        } catch (err) {
          console.warn('⚠️ 날짜 변환 오류:', err);
        }

        return {
          id: doc.id,
          title: data.title || '(제목 없음)',
          description: data.description || '',
          date,
        };
      });

      setEvents(fetched);
    } catch (err) {
      console.error('❌ 이벤트 불러오기 오류:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchEvents);
    return unsubscribe;
  }, [navigation]);

  const onPressAdd = () => navigation.navigate('EventUpdate');

  const onPressDelete = (id: string) => {
    setToDeleteId(id);
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      await deleteDoc(doc(db, 'events', toDeleteId));
      setEvents(ev => ev.filter(e => e.id !== toDeleteId));
    } catch (err) {
      console.error('삭제 오류:', err);
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <Ionicons name="person-circle-outline" size={80} color="#333" style={{ alignSelf: 'center' }} />
        <Text style={{ textAlign: 'center', marginVertical: 12 }}>E‑Mail: 11@devfox.co.jp</Text>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 2,
          borderBottomColor: '#007AFF',
          paddingBottom: 8,
          marginBottom: 12
        }}>
          <Ionicons name="calendar-outline" size={24} />
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginHorizontal: 8, flex: 1 }}>イベント</Text>
          <TouchableOpacity onPress={onPressAdd}>
            <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {events.map(ev => (
          <TouchableOpacity
            key={ev.id}
            onPress={() =>
              navigation.navigate('EventUpdate', {
                id: ev.id,
                title: ev.title,
                description: ev.description,
                date: ev.date,
              })
            }
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#ddd'
            }}
          >
            <View>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>{ev.title}</Text>
              <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{ev.date}</Text>
            </View>
            <TouchableOpacity onPress={() => onPressDelete(ev.id)}>
              <Ionicons name="trash-outline" size={24} color="#999" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {events.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
            등록된 이벤트가 없습니다
          </Text>
        )}

        <Modal transparent visible={modalVisible} animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '80%', backgroundColor: '#fff', borderRadius: 8, padding: 20 }}>
              <Text style={{ fontSize: 16, textAlign: 'center' }}>本当に削除しますか？</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 8, backgroundColor: '#eee', borderRadius: 6 }}>
                  <Text>닫기</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmDelete} style={{ padding: 8, backgroundColor: '#d00', borderRadius: 6 }}>
                  <Text style={{ color: '#fff' }}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}
