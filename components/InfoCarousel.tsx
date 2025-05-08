import React, { useRef, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native';

const sliderWidth = Dimensions.get('window').width;
const itemWidth = sliderWidth * 0.9;

const data = [
  { id: '1', image: require('../assets/event1.jpg') },
  { id: '2', image: require('../assets/event2.jpg') },
  { id: '3', image: require('../assets/event3.jpg') },
];

const InfoSlider = () => {
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % data.length;
      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });
    }, 4000); // 4초마다 슬라이드

    return () => clearInterval(interval);
  }, []);

  return (
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Image source={item.image} style={styles.image} resizeMode="cover" />
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={true} // 유저 스크롤 비활성화
        />
      </View>
    );
  };

export default InfoSlider;

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
});