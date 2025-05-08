import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyPageMarketStackParamList } from '../components/MyPageMarketStack';
import { ParamListBase } from '@react-navigation/native';

// ⚠️ 실제 BottomTab의 param 타입이 없기 때문에 임시로 ParamListBase 사용
type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<ParamListBase, 'MypageTab'>,
  StackNavigationProp<MyPageMarketStackParamList>
>;

const Header = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '確認',
          onPress: () => {
            console.log('ログアウト処理');
            // 로그아웃 처리 후 로그인 화면으로 이동도 여기에 구현 가능
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LOGO</Text>

      <View style={styles.rightButtons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MypageTab', { screen: 'MyPageTop' })}
        >
          <Text style={styles.buttonText}>Mypage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>ログアウト</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightButtons: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: '#0080A0',
  },
  buttonText: {
    fontSize: 14,
  },
});
