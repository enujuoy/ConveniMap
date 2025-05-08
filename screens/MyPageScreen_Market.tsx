import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { RootStackParamList } from '../App'; // ✅ App.tsx에서 정의한 타입 임포트

type RootStackNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const MyPageScreen_Market = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/user_icon.jpg')} />
      <Text style={styles.email}>E-Mail: 11@devfox.co.jp</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('StoreRegister')} 
        >
          <Image source={require('../assets/store_icon.jpg')} style={styles.icon} />
          <Text>店舗登録・管理</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('ProductRegistration')} // ✅ App.tsx 최상위 라우트로 이동
        >
          <Image source={require('../assets/product_icon.jpg')} style={styles.icon} />
          <Text>商品登録・管理</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EventManagement')} // ✅ App.tsx 최상위 라우트로 이동
        >
          <Image source={require('../assets/event_icon.jpg')} style={styles.icon} />
          <Text>イベント登録・管理</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/account_icon.jpg')} style={styles.icon} />
          <Text>アカウント管理</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, alignItems: 'center' },
  buttonContainer: { width: '90%', flexDirection: 'column', alignItems: 'center' },
  button: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  email: { fontSize: 16, marginBottom: 20 },
  icon: { width: 40, height: 40, marginRight: 15 },
});

export default MyPageScreen_Market;