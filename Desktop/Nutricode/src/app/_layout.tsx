import { Stack } from 'expo-router';
import { AuthProvider } from '@/src/context/AuthContext';
import { registerBackgroundNotifications } from '@/src/services/notifications';
import { useEffect } from 'react';

export default function MainLayout() {
  useEffect(() => {
    registerBackgroundNotifications().catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          animationDuration: 250,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="(auth)/signup/page"
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="(auth)/onboarding/page"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="(panel)"
          options={{ animation: 'fade', gestureEnabled: false }}
        />
      </Stack>
    </AuthProvider>
  );
}
