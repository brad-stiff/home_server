// app/utils/tokenStorage.ts
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'jwt';

export async function saveToken(token: string) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function loadToken() {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(TOKEN_KEY);
  } else {
    return SecureStore.getItemAsync(TOKEN_KEY);
  }
}

export async function deleteToken() {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}
