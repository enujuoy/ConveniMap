// 사용자가 선택한 메뉴/아메니티만 저장
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function saveSelectedCategories({
  selectedMenus,
  selectedAmenities,
}: {
  selectedMenus?: string[];
  selectedAmenities?: string[];
}) {
  const docRef = doc(db, 'userPreferences', 'selected');

  await setDoc(docRef, {
    ...(selectedMenus ? { selectedMenus } : {}),
    ...(selectedAmenities ? { selectedAmenities } : {}),
  }, { merge: true });

  console.log('✅ 선택된 카테고리 저장 완료');
}
