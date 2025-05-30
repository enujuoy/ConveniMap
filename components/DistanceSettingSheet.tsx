// components/DistanceSettingSheet.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

type DistanceSettingSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  radius: number;
  setRadius: (radius: number) => void;
  allowNotification: boolean;
  setAllowNotification: (value: boolean) => void;
};

const LANGUAGES = [
  { code: 'ko', label: '한국어' },
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
];

export default function DistanceSettingSheet({
  isVisible,
  onClose,
  radius,
  setRadius,
  allowNotification,
  setAllowNotification,
}: DistanceSettingSheetProps) {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    AsyncStorage.getItem('userLang').then((lang) => {
      if (lang) setCurrentLang(lang);
    });
  }, []);

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

  const changeLanguage = async (lang: string) => {    
    await AsyncStorage.setItem('userLang', lang);
    await AsyncStorage.setItem('hasUserSetLang', 'true');
    await i18n.changeLanguage(lang);
    setCurrentLang(lang);
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{t('settings.title')}</Text>

          <Text style={styles.sectionTitle}>{t('settings.notificationDistance')}</Text>
          <View style={styles.buttonRow}>
            {radiusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  radius === option && styles.optionSelected,
                ]}
                onPress={() => setRadius(option)}
              >
                <Text
                  style={
                    radius === option
                      ? styles.optionTextSelected
                      : styles.optionText
                  }
                >
                  {option}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>{t('settings.notificationAction')}</Text>
          <SettingSwitch
            label={t('settings.allowPush')}
            value={allowNotification}
            onChange={setAllowNotification}
          />

          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <View style={styles.buttonRow}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.optionButton,
                  currentLang === lang.code && styles.optionSelected,
                ]}
                onPress={() => changeLanguage(lang.code)}
              >
                <Text
                  style={
                    currentLang === lang.code
                      ? styles.optionTextSelected
                      : styles.optionText
                  }
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

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
