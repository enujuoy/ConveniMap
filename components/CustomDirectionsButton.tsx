import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Linking, View, Platform, TouchableHighlight } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface Props {
  destinationLat: number;
  destinationLon: number;
}

export default function CustomDirectionsButton({ destinationLat, destinationLon }: Props) {
  const { t } = useTranslation();

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLon}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.overlayWrapper}>
      <TouchableHighlight
        style={styles.button}
        onPress={openGoogleMaps}
        underlayColor="#ddd" // ✅ 눌렀을 때 회색 효과
        >
        <View style={styles.inner}>
            <MaterialIcons name="directions" size={20} color="#333" />
            <Text style={styles.text}>{t('map.route')}</Text>
        </View>
        </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayWrapper: {
    position: 'absolute',
    bottom: 18,
    right: 3,
    zIndex: 999, // ✅ 가장 위에 표시
    elevation: 10, // ✅ Android에서 네이티브 위에 띄우기
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  text: {
    marginLeft: 6,
    color: '#333',
    fontSize: 14,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
