import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as DocumentPicker from 'expo-document-picker';
import { StackScreenProps } from '@react-navigation/stack';
import { format } from 'date-fns';
import { MyPageMarketStackParamList } from '../components/MyPageMarketStack';
import { addEventToFirestore } from '../firebaseUtils/addEvent';

type Props = StackScreenProps<MyPageMarketStackParamList, 'EventUpdate'>;

export default function EventUpdateScreen({ navigation, route }: Props) {
  const isEdit = !!route.params;

  console.log('route.params:', route.params); // 🔍 로그 출력

  const parseDateRange = (range?: string) => {
    if (!range || !range.includes('～')) return [new Date(), new Date()];
    const [startStr, endStr] = range.split('～');
    const start = new Date(startStr);
    const end = new Date(endStr);
    return [
      isNaN(start.getTime()) ? new Date() : start,
      isNaN(end.getTime()) ? new Date() : end,
    ];
  };

  const [startDate, setStartDate] = useState(() => {
    if (isEdit) {
      const [start] = parseDateRange(route.params.date);
      return start;
    }
    return new Date();
  });

  const [endDate, setEndDate] = useState(() => {
    if (isEdit) {
      const [, end] = parseDateRange(route.params.date);
      return end;
    }
    return new Date();
  });

  const [title, setTitle] = useState(route.params?.title || '');
  const [desc, setDesc] = useState(route.params?.description || '');
  const [fileName, setFileName] = useState('');
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({});
      if (!res.canceled && res.assets?.length > 0) {
        setFileName(res.assets[0].name);
      } else {
        console.log('📁 파일 선택 취소 또는 없음');
      }
    } catch (e: any) {
      Alert.alert('파일 선택 중 예외가 발생했습니다.', e.message);
    }
  };

  const onCreate = async () => {
    if (!title.trim()) {
      Alert.alert('イベント名を入力してください。');
      return;
    }
    if (startDate > endDate) {
      Alert.alert('시작일은 종료일보다 빠르거나 같아야 합니다.');
      return;
    }

    try {
      await addEventToFirestore(title, desc, startDate, endDate, fileName);
      Alert.alert(isEdit ? 'イベントが更新されました。' : 'イベントが作成されました。');
      navigation.goBack();
    } catch (e) {
      Alert.alert('イベント保存に失敗しました。');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateRow}>
        <TouchableOpacity onPress={() => setShowStart(true)}>
          <Text>{format(startDate, 'yyyy.MM.dd')}</Text>
        </TouchableOpacity>
        <Text> 〜 </Text>
        <TouchableOpacity onPress={() => setShowEnd(true)}>
          <Text>{format(endDate, 'yyyy.MM.dd')}</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={showStart}
        mode="date"
        date={startDate}
        onConfirm={(d) => {
          setStartDate(d);
          setShowStart(false);
        }}
        onCancel={() => setShowStart(false)}
        minimumDate={new Date()}
      />
      <DateTimePickerModal
        isVisible={showEnd}
        mode="date"
        date={endDate}
        onConfirm={(d) => {
          setEndDate(d);
          setShowEnd(false);
        }}
        onCancel={() => setShowEnd(false)}
        minimumDate={startDate}
      />

      <TextInput
        style={styles.input}
        placeholder="イベント名"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="イベント情報"
        value={desc}
        onChangeText={setDesc}
        multiline
      />

      <TouchableOpacity style={styles.uploadBtn} onPress={pickFile}>
        <Text>ファイル添付</Text>
      </TouchableOpacity>
      {fileName ? <Text style={{ marginBottom: 12 }}>{fileName}</Text> : null}

      <View style={styles.btnRow}>
        <Button title={isEdit ? '更新' : '作成'} onPress={onCreate} />
        <Button title="戻る" color="#999" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadBtn: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
});
