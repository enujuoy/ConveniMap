// components/PopupController.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Popup from './Popup';

export default function PopupController({
  text,
  onDismiss,
}: {
  text: string;
  onDismiss: () => void;
}) {
  // 필수: Swipeable에 좌/우 액션이 하나라도 있어야 동작함
  const renderSwipeActions = () => <View style={{ width: 1 }} />;

  return (
    <View style={styles.wrapper}>
      <Swipeable
        renderRightActions={renderSwipeActions}
        renderLeftActions={renderSwipeActions}
        onSwipeableOpen={onDismiss}
        overshootLeft={false}
        overshootRight={false}
      >
        <Popup text={text} type="highlight" />
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    zIndex: 999,
  },
});
