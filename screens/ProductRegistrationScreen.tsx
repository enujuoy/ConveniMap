import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type ProductRegistrationNavProp = StackNavigationProp<
  RootStackParamList,
  'ProductRegistration'
>;

const ProductRegistrationScreen = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [productName, setProductName] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [storeDetailCode, setStoreDetailCode] = useState('');

  const navigation = useNavigation<ProductRegistrationNavProp>();

  const handleRegistration = async () => {
    try {
      await addDoc(collection(db, 'storeDetails'), {
        createdAt: new Date(),
        imageUrl: imageUrl,
        price: price,
        productName: productName,
        storeCode: storeCode,
        storeDetailCode: storeDetailCode,
      });

      Alert.alert('登録成功！', '商品登録情報が正常に登録されました。');
      navigation.navigate('ServiceAreaInfoScreen');
    } catch (error) {
      console.error('登録失敗！:', error);
      Alert.alert('登録失敗！', '商品登録中にエラーが発生しました。');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>商品登録</Text>

  
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Store Code"
        value={storeCode}
        onChangeText={setStoreCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Store Detail Code"
        value={storeDetailCode}
        onChangeText={setStoreDetailCode}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegistration}>
        <Text style={styles.buttonText}>登録</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ProductRegistrationScreen;
