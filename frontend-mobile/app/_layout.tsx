// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/auth_context';
import LoginModal from '@/components/LoginModal';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}

function RootLayoutInner() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#25292e' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
        <Stack.Screen name="games/breakout" options={{ title: 'Breakout' }} />
        <Stack.Screen name="games/blitzball" options={{ title: 'Blitzball' }} />
      </Stack>

      <LoginModal />
    </>
  );
}
