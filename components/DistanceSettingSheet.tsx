import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';

type DistanceSettingSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  radius: number;
  setRadius: (radius: number) => void;
  allowNotification: boolean;
  setAllowNotification: (value: boolean) => void;
  allowSound: boolean;
  setAllowSound: (value: boolean) => void;
  allowVibration: boolean;
  setAllowVibration: (value: boolean) => void;
};

const DistanceSettingSheet = ({
  isVisible,
  onClose,
  radius,
  setRadius,
  allowNotification,
  setAllowNotification,
  allowSound,
  setAllowSound,
  allowVibration,
  setAllowVibration,
}: DistanceSettingSheetProps) => {
  const radiusOptions = [300, 500, 1000];

  const SettingSwitch = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
  }) => (
    <View style={styles.switchRow}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>通知設定</Text>

          <Text style={styles.sectionTitle}>通知距離</Text>
          <View style={styles.buttonRow}>
            {radiusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, radius === option && styles.optionSelected]}
                onPress={() => setRadius(option)}
              >
                <Text style={radius === option ? styles.optionTextSelected : styles.optionText}>
                  {option}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>通知動作</Text>
          <SettingSwitch
            label="プッシュ通知を許可"
            value={allowNotification}
            onChange={setAllowNotification}
          />
          <SettingSwitch
            label="通知音を鳴らす"
            value={allowSound}
            onChange={setAllowSound}
          />
          <SettingSwitch
            label="バイブレーションを使用"
            value={allowVibration}
            onChange={setAllowVibration}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DistanceSettingSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  optionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#000',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  label: {
    fontSize: 15,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
