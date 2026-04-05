import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../lib/auth';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="tabs" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/signup" />
          <Stack.Screen name="booking/[serviceId]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="quote" options={{ presentation: 'modal' }} />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
