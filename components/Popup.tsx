// components/Popup.tsx

import React from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity } from 'react-native';

type PopupProps = {
  text: string;
  opacity?: Animated.Value;
  translateY?: Animated.Value;
  type: 'normal' | 'highlight' | 'event';
  onPress?: () => void; // ✅ 클릭 핸들러 추가
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function Popup({ text, opacity, translateY, type, onPress }: PopupProps) {
  const isHighlight = type === 'highlight';
  const isEvent = type === 'event';

  const popupStyle = isHighlight
    ? styles.popupYellow
    : isEvent
    ? styles.popupBlue
    : styles.popupWhite;

  return (
    <AnimatedTouchable
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        popupStyle,
        {
          opacity: opacity ?? new Animated.Value(1),
          transform: [{ translateY: translateY ?? new Animated.Value(0) }],
        },
      ]}
    >
      <Text style={styles.popupText}>{text}</Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  popupWhite: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#ffffffcc',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  popupYellow: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#fff89acc',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  popupBlue: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    right: 20,
    backgroundColor: '#add8e699',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  popupText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
