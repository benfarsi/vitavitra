import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/auth';
import { Colors } from '../constants/theme';

export default function Index() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.replace('/tabs/home');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [session, loading]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.navy, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={Colors.blue} size="large" />
    </View>
  );
}
