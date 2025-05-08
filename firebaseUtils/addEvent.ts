import { db } from '../firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export const addEventToFirestore = async (
  title: string,
  desc: string,
  startDate: Date,
  endDate: Date,
  fileName: string
) => {
  try {
    await addDoc(collection(db, 'events'), {
      title,
      description: desc,
      eventCode: 'EVT001',  // 필요에 따라 자동 생성하도록 개선 가능
      storeCode: 'STR001',  // 사용자나 가게에 따라 다르게 처리 가능
      startDate,
      endDate,
      createdAt: serverTimestamp(),
      image: fileName || null, // 실제로는 imageUrl 필요 시 Storage 연동 필요
    });
  } catch (error) {
    console.error('이벤트 등록 중 오류:', error);
    throw error;
  }
};
