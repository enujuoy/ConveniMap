import { useEffect, useState } from 'react';
import { getNearbyStores } from './getNearbyStores';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getDistance } from './distance';
import { NearbyStore, StoreWithDetails, UserPreferences, StoreEvent } from '../types';
import { notifyNearbyStores } from './sendStoreNotifications';

export default function useNearbyStores(lat: number, lon: number, radius: number) {
  const [stores, setStores] = useState<StoreWithDetails[]>([]);
  const [popupText, setPopupText] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [highlight, setHighlight] = useState(false);

  const [eventPopupText, setEventPopupText] = useState('');
  const [eventPopupVisible, setEventPopupVisible] = useState(false);

  const [selectedStore, setSelectedStore] = useState<StoreWithDetails | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<StoreEvent | null>(null);

  const hidePopup = () => setPopupVisible(false);
  const hideEventPopup = () => setEventPopupVisible(false);

  const fetchUserPreferences = async (): Promise<UserPreferences> => {
    const docRef = collection(db, 'userPreferences');
    const q = query(docRef, where('__name__', '==', 'selected'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return {
        selectedAmenities: Array.isArray(data.selectedAmenities) ? data.selectedAmenities : [],
        selectedMenus: Array.isArray(data.selectedMenus) ? data.selectedMenus : [],
      };
    } else {
      return { selectedAmenities: [], selectedMenus: [] };
    }
  };

  const fetchStores = async () => {
    if (lat === 0 && lon === 0) return;

    const nearby = await getNearbyStores(lat, lon, radius);

    const detailedStores: StoreWithDetails[] = await Promise.all(
      nearby.map(async (store: NearbyStore): Promise<StoreWithDetails> => {
        const storeSnap = await getDocs(
          query(collection(db, 'serviceAreas'), where('name', '==', store.name))
        );

        let storeCode = '';
        let amenities: string[] = [];
        let menu: string[] = [];

        if (!storeSnap.empty) {
          const storeData = storeSnap.docs[0].data();
          storeCode = storeData.storeCode || '';
          amenities = storeData.amenities || [];
          menu = storeData.menu || [];
        }

        return {
          ...store,
          description: '',
          amenities,
          menu,
          storeCode, // ✅ storeCode로 추가
        };
      })
    );

    setStores(detailedStores);
    await notifyNearbyStores(nearby);
    checkForPopup(detailedStores);
  };

  const checkForPopup = async (detailedStores: StoreWithDetails[]) => {
    if (lat === 0 && lon === 0 || detailedStores.length === 0) return;

    const userPrefs = await fetchUserPreferences();
    const cleanUserAmenities = userPrefs.selectedAmenities.filter(a => a.trim() !== '');
    const cleanUserMenus = userPrefs.selectedMenus.filter(m => m.trim() !== '');

    for (const store of detailedStores) {
      const dist = getDistance(lat, lon, store.latitude, store.longitude);
      if (dist * 1000 < 300) {
        const amenityText = store.amenities?.length ? `\n🛠️ 設備: ${store.amenities.join(', ')}` : '';
        const menuText = store.menu?.length ? `\n🍽️ メニュー: ${store.menu.join(', ')}` : '';

        const eventSnap = await getDocs(
          query(collection(db, 'events'), where('storeCode', '==', store.storeCode))
        );

        if (!eventSnap.empty) {
          const eventDoc = eventSnap.docs[0].data();
          const event: StoreEvent = {
            title: eventDoc.title,
            description: eventDoc.description,
            image: eventDoc.image ?? null,
            date: eventDoc.startDate ?? '',
          };

          setEventPopupText(`🎉 ${event.title}\n${event.description}`);
          setEventPopupVisible(true);
          setSelectedEvent(event);
        }

        const lowerStoreAmenities = (store.amenities || []).map(a => a.toLowerCase());
        const lowerStoreMenus = (store.menu || []).map(m => m.toLowerCase());
        const lowerUserAmenities = cleanUserAmenities.map(a => a.toLowerCase());
        const lowerUserMenus = cleanUserMenus.map(m => m.toLowerCase());

        const matched =
          lowerStoreAmenities.some(a => lowerUserAmenities.includes(a)) ||
          lowerStoreAmenities.some(a => lowerUserMenus.includes(a)) ||
          lowerStoreMenus.some(m => lowerUserAmenities.includes(m)) ||
          lowerStoreMenus.some(m => lowerUserMenus.includes(m));

        setPopupText(`📍 ${store.name}${amenityText}${menuText}`);
        setPopupVisible(true);
        setHighlight(matched);
        setSelectedStore(store);
        return;
      }
    }

    setPopupVisible(false);
    setEventPopupVisible(false);
    setHighlight(false);
    setSelectedStore(null);
    setSelectedEvent(null);
  };

  useEffect(() => {
    fetchStores();
  }, [lat, lon, radius]);

  return {
    stores,
    popupText,
    popupVisible,
    hidePopup,
    highlight,
    eventPopupText,
    eventPopupVisible,
    hideEventPopup,
    selectedStore,
    selectedEvent,
    fetchStores,
  };
}
