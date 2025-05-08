// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // Firestore 추가
import { getAnalytics } from "firebase/analytics";  // Analytics도 사용할 경우 임포트

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWtSYYy1V1YgqGcDKee64Ey-bxny7srEM",
  authDomain: "convenipj.firebaseapp.com",
  projectId: "convenipj",
  storageBucket: "convenipj.firebasestorage.app",
  messagingSenderId: "448686159790",
  appId: "1:448686159790:web:c1217f98781a30a1c77a3f",
  measurementId: "G-H10JHBH514"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Firestore 초기화

export { db };  // db를 다른 파일에서 사용할 수 있도록 export
