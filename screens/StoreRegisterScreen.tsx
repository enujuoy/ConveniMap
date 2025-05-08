import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function StoreRegisterScreen() {
  const [storeName, setStoreName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const navigation = useNavigation<any>(); // ✅ 타입 에러 방지용 any 지정

  const handleRegister = async () => {
    if (!storeName.trim()) {
      Alert.alert('店舗名を入力してください。');
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('電話番号を入力してください。');
      return;
    }
    if (!selectedService) {
      Alert.alert('サービスエリアを選択してください。');
      return;
    }

    try {
      await addDoc(collection(db, 'stores'), {
        storeName,
        phoneNumber,
        description,
        selectedService,
        createdAt: serverTimestamp(),
      });

      setStoreName('');
      setPhoneNumber('');
      setDescription('');
      setSelectedService('');

      Alert.alert('店舗が登録されました。');
      const tabNavigation = navigation.getParent();
      tabNavigation?.navigate('MypageTab'); 
    } catch (error) {
      console.error('登録エラー:', error);
      Alert.alert('店舗登録に失敗しました。');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>店舗登録・管理</Text>

      <TextInput
        style={styles.input}
        placeholder="店舗名を入力してください"
        value={storeName}
        onChangeText={setStoreName}
      />

      <TextInput
        style={styles.input}
        placeholder="電話番号を入力してください"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="店舗紹介を入力してください。"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedService}
          onValueChange={(itemValue) => setSelectedService(itemValue)}
        >
          <Picker.Item label="サービスエリアを選択してください" value="" />
          <Picker.Item label="セブン-イレブン 大田区本羽田１丁目店" value="seven1chome" />
          <Picker.Item label="ファミリーマート 大田本羽田二丁目店" value="familymart" />
          <Picker.Item label="ローソンストア100 南六郷店" value="rawson100" />
          <Picker.Item label="セブン-イレブン 大田区南六郷２丁目店" value="seven2chome" />
          <Picker.Item label="ローソン 東六郷二丁目店" value="rawson2chome" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>作成</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
