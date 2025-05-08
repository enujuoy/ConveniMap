import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AreaSelector = () => {
  const [selectedArea, setSelectedArea] = useState('tokyo');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>サービスエリア選択</Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedArea}
          onValueChange={(itemValue) => setSelectedArea(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="東京" value="tokyo" />
          <Picker.Item label="大阪" value="osaka" />
          <Picker.Item label="名古屋" value="nagoya" />
          <Picker.Item label="札幌" value="sapporo" />
        </Picker>
      </View>
    </View>
  );
};

export default AreaSelector;

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    width: '100%',
  },
});