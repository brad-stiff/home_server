// app/utils/tokenStorage.ts
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

type StoredTokens = {
  access_token: string | null;
  refresh_token: string | null;
};

async function setItem(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    if (value === null) {
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } else {
    if (value === null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(key);
  } else {
    return SecureStore.getItemAsync(key);
  }
}

export async function saveTokens(access_token: string, refresh_token: string) {
  await setItem(ACCESS_TOKEN_KEY, access_token);
  await setItem(REFRESH_TOKEN_KEY, refresh_token);
}

export async function loadTokens(): Promise<StoredTokens> {
  const [access_token, refresh_token] = await Promise.all([
    getItem(ACCESS_TOKEN_KEY),
    getItem(REFRESH_TOKEN_KEY),
  ]);

  return {
    access_token,
    refresh_token,
  };
}

export async function deleteTokens() {
  await setItem(ACCESS_TOKEN_KEY, null);
  await setItem(REFRESH_TOKEN_KEY, null);
}
