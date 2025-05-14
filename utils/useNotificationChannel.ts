// utils/useNotificationChannel.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

/**
 * 사용자 설정에 따라 알림 채널을 생성하고 채널 ID를 반환합니다.
 * Android에서만 동작하며, iOS는 null 반환
 */
export async function createNotificationChannel(allowSound: boolean, allowVibration: boolean): Promise<string | null> {
  if (Platform.OS !== 'android') return null;

  const baseName = `${allowSound ? 'sound' : 'silent'}-${allowVibration ? 'vib' : 'novib'}`;
  const channelId = `channel-${baseName}-${uuidv4()}`;

  await Notifications.setNotificationChannelAsync(channelId, {
    name: `알림 (${baseName})`,
    importance: Notifications.AndroidImportance.HIGH,
    sound: allowSound ? 'default' : 'silent',
    enableVibrate: allowVibration,
    vibrationPattern: allowVibration ? [0, 250, 250, 250] : undefined,
  });

  return channelId;
}
