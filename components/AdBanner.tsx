import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function AdBanner() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/banner.png')} // ✅ 임시 배너 이미지 파일
        style={styles.banner}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
});
