import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { CategoryKey } from '../utils/constants';

const categories: { key: CategoryKey; label: string }[] = [
  { key: 'convenience', label: 'コンビニ' },
  { key: 'drugstore', label: 'ドラッグストア' },
  { key: 'mart', label: 'マート' },
];

interface Props {
  selectedCategories: CategoryKey[];
  setSelectedCategories: (cats: CategoryKey[]) => void;
  openNowOnly: boolean;
  setOpenNowOnly: (value: boolean) => void;
}

export default function CategorySelector({
  selectedCategories,
  setSelectedCategories,
  openNowOnly,
  setOpenNowOnly,
}: Props) {
  const toggleCategory = (key: CategoryKey) => {
    if (selectedCategories.includes(key)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== key));
    } else {
      setSelectedCategories([...selectedCategories, key]);
    }
  };

  return (
    <View style={styles.overlay}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map(({ key, label }) => {
          const selected = selectedCategories.includes(key);
          return (
            <TouchableOpacity
              key={key}
              onPress={() => toggleCategory(key)}
              style={[
                styles.button,
                { backgroundColor: selected ? '#ccc' : '#fff' },
              ]}
            >
              <Text style={{ color: selected ? 'black' : 'gray' }}>{label}</Text>
            </TouchableOpacity>
          );
        })}

        {/* 영업중 버튼 */}
        <TouchableOpacity
          onPress={() => setOpenNowOnly(!openNowOnly)}
          style={[
            styles.button,
            { backgroundColor: openNowOnly ? '#ccc' : '#fff' },
          ]}
        >
          <Text style={{ color: openNowOnly ? 'black' : 'gray' }}>営業中のみ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#999',
  },
});
