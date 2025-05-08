import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// 네비게이션 타입 정의
type RootStackParamList = {
  EventDetail: {
    title: string;
    description: string;
    date: string;
    image: any;
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'EventDetail'>;

interface StoreDetail {
  createdAt: string;
  imageUrl: string;
  price: string;
  productName: string;
  storeCode: string;
  storeDetailCode: string;
}

export default function ServiceAreaInfoScreen() {
  const [storeDetails, setStoreDetails] = useState<StoreDetail[]>([]);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'storeDetails'));
        const storeDetailsList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          // 타임스탬프 처리 - toDate() 메서드 사용
          let createdAtFormatted = 'N/A';
          if (data.createdAt) {
            // Firestore 타임스탬프 객체인지 확인
            if (data.createdAt.toDate) {
              createdAtFormatted = data.createdAt.toDate().toLocaleDateString();
            } else if (data.createdAt.seconds) {
              // seconds/nanoseconds 형식인 경우
              createdAtFormatted = new Date(data.createdAt.seconds * 1000).toLocaleDateString();
            }
          }
          
          return {
            ...data,
            // 모든 날짜 필드를 문자열로 변환
            createdAt: createdAtFormatted
          } as StoreDetail;
        });
        setStoreDetails(storeDetailsList);
      } catch (error) {
        console.error('Error fetching storeDetails:', error);
      }
    };

    fetchStoreDetails();
  }, []);

  const handleEventButtonPress = () => {
    // EventDetailScreen으로 이동
    navigation.navigate('EventDetail', {
      title: "100円引きセール", // Firestore의 이벤트 제목
      description: "100円引きセール", // Firestore의 이벤트 설명
      date: "2025년 4월 24일 오전 11시 16분 58초 ~ 2025년 4월 24일 오전 11시 18분 12초",
      image: require('../assets/event1.jpg') // 이미지 파일 경로를 실제 사용중인 경로로 수정하세요
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>店舗名たこしわ</Text>
      {storeDetails.map((detail, index) => (
        <View key={index} style={styles.detailCard}>
          <Text style={styles.productName}>Product: {detail.productName}</Text>
          <Text>Price: {detail.price}</Text>
        </View>
      ))}
      
      {/* 이벤트 확인 버튼 */}
      <TouchableOpacity 
        style={styles.eventButton}
        onPress={handleEventButtonPress}
      >
        <Text style={styles.eventButtonText}>イベント確認</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  detailCard: { marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ddd' },
  productName: { fontSize: 16, fontWeight: 'bold' },
  eventButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  eventButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
