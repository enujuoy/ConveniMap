// components/LocationSelector.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const LocationSelector = () => {
  const [departure, setDeparture] = useState('shibuya');
  const [destination, setDestination] = useState('shinjuku');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>出発地と目的地の選択</Text>

      <View style={styles.selectorRow}>
        <Picker
          selectedValue={departure}
          onValueChange={(value) => setDeparture(value)}
          style={styles.picker}
        >
          <Picker.Item label="渋谷" value="shibuya" />
          <Picker.Item label="新宿" value="shinjuku" />
          <Picker.Item label="池袋" value="ikebukuro" />
        </Picker>

        <Text style={styles.arrow}>→</Text>

        <Picker
          selectedValue={destination}
          onValueChange={(value) => setDestination(value)}
          style={styles.picker}
        >
          <Picker.Item label="渋谷" value="shibuya" />
          <Picker.Item label="新宿" value="shinjuku" />
          <Picker.Item label="池袋" value="ikebukuro" />
        </Picker>
      </View>
    </View>
  );
};

export default LocationSelector;

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  picker: {
    flex: 1,
    height: 48,
  },
  arrow: {
    fontSize: 20,
    marginHorizontal: 4,
  },
});
