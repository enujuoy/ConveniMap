import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

type ChannelKey = `${'on' | 'off'}-${'on' | 'off'}`; // "on-on", "off-off" 형태

const channelCache = new Map<ChannelKey, string>(); // 설정별 채널 ID 저장
const activeChannels = new Set<string>(); // 만든 채널 추적

/**
 * 🔧 알림 채널 캐시 초기화: 기존 채널 모두 삭제
 */
export async function clearAllNotificationChannels() {
  if (Platform.OS !== 'android') return;

  const channels = await Notifications.getNotificationChannelsAsync();
  for (const channel of channels) {
    await Notifications.deleteNotificationChannelAsync(channel.id);
  }
  channelCache.clear();
  activeChannels.clear();
}

/**
 * ✅ 설정에 맞는 채널 ID 생성 or 재사용
 */
export async function getOrCreateChannel(allowSound: boolean, allowVibration: boolean): Promise<string | null> {
  if (Platform.OS !== 'android') return null;

  const key: ChannelKey = `${allowSound ? 'on' : 'off'}-${allowVibration ? 'on' : 'off'}`;
  if (channelCache.has(key)) return channelCache.get(key)!;

  const id = `dynamic-${key}-${uuidv4()}`;
  await Notifications.setNotificationChannelAsync(id, {
    name: `알림 (${key})`,
    importance: Notifications.AndroidImportance.HIGH,
    sound: allowSound ? 'default' : 'silent',
    enableVibrate: allowVibration,
    vibrationPattern: allowVibration ? [0, 300, 300, 300] : undefined,
  });

  channelCache.set(key, id);
  activeChannels.add(id);
  return id;
}

/**
 * 🧹 일정 시간 뒤 사용한 알림 채널 자동 삭제
 */
export function scheduleChannelCleanup(timeoutMs = 30000) {
  if (Platform.OS !== 'android') return;

  setTimeout(async () => {
    for (const id of activeChannels) {
      try {
        await Notifications.deleteNotificationChannelAsync(id);
      } catch (e) {
        console.warn(`삭제 실패: ${id}`);
      }
    }
    channelCache.clear();
    activeChannels.clear();
  }, timeoutMs);
}
