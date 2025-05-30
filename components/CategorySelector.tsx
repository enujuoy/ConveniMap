//CategorySelector.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { CategoryKey } from '../utils/constants';

const categories: {
  key: CategoryKey;
  icon: any;
}[] = [
  {
    key: 'convenience',
    icon: require('../assets/local_convenience_store.png'),
  },
  {
    key: 'drugstore',
    icon: require('../assets/local_pharmacy.png'),
  },
  {
    key: 'mart',
    icon: require('../assets/shopping_cart.png'),
  },
];

interface Props {
  selectedCategories?: CategoryKey[];
  setSelectedCategories: (cats: CategoryKey[]) => void;
}

export default function CategorySelector(props: Props) {
  const {
    selectedCategories = [],
    setSelectedCategories,
  } = props;

  const { t } = useTranslation();

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
        {categories.map(({ key, icon }) => {
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
              <Image source={icon} style={styles.icon} />
              <Text style={{ color: selected ? 'black' : 'gray' }}>
                {t(`categories.${key}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#999',
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
});
