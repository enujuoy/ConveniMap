import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingButtonProps {
  onPress: () => void;
}

export default function SettingButton({ onPress }: SettingButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="settings-sharp" size={24} color="#333" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 60, // 카테고리 버튼 아래 예상 위치
    right: 8, // 오른쪽에 정렬
    backgroundColor: '#fff',
    padding: 4, // 축소
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#999',
    zIndex: 10,
  },
});
