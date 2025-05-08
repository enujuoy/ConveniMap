import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function ToggleButton({ label, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, selected && styles.selected]}
      onPress={onPress}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#999',
    margin: 6,
    backgroundColor: '#fff',
  },
  selected: {
    backgroundColor: '#ddd',
    borderColor: '#666',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  selectedText: {
    fontWeight: 'bold',
  },
});
