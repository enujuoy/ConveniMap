import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import PopupMessage from './Popup';

type PopupContainerProps = {
  popupVisible: boolean;
  popupText: string;
  highlight: boolean;
  eventPopupVisible: boolean;
  eventPopupText: string;
};

export default function PopupContainer({
  popupVisible,
  popupText,
  highlight,
  eventPopupVisible,
  eventPopupText,
}: PopupContainerProps) {
  const popupOpacity = useRef(new Animated.Value(0)).current;
  const popupTranslateY = useRef(new Animated.Value(50)).current;

  const eventPopupOpacity = useRef(new Animated.Value(0)).current;
  const eventPopupTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (popupVisible) {
      Animated.parallel([
        Animated.timing(popupOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(popupTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(popupOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(popupTranslateY, { toValue: 50, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [popupVisible]);

  useEffect(() => {
    if (eventPopupVisible) {
      Animated.parallel([
        Animated.timing(eventPopupOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(eventPopupTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(eventPopupOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(eventPopupTranslateY, { toValue: 50, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [eventPopupVisible]);

  return (
    <>
      {popupVisible && (
        <PopupMessage
          text={popupText}
          opacity={popupOpacity}
          translateY={popupTranslateY}
          type={highlight ? 'highlight' : 'normal'}
        />
      )}
      {eventPopupVisible && (
        <PopupMessage
          text={eventPopupText}
          opacity={eventPopupOpacity}
          translateY={eventPopupTranslateY}
          type="highlight"
        />
      )}
    </>
  );
}
