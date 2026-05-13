import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../src/stores/useAuthStore';
import { Colors } from '../src/constants/colors';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
});

function AuthLoader({ children }: { children: React.ReactNode }) {
  const { isLoading, loadSession } = useAuthStore();

  useEffect(() => {
    loadSession();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthLoader>
          <Stack>
            <Stack.Screen name="(tabs)"                                    options={{ headerShown: false }} />
            <Stack.Screen name="login"                                     options={{ headerShown: false }} />
            <Stack.Screen name="register"                                  options={{ headerShown: false }} />
            <Stack.Screen name="region/[id]"                               options={{ title: '지역 상세' }} />
            <Stack.Screen name="province/[id]"                             options={{ title: '시·군 선택' }} />
            <Stack.Screen name="permit-flow/[regionId]/index"              options={{ title: '인허가 진행' }} />
            <Stack.Screen name="permit-flow/[regionId]/step/[stepId]"      options={{ title: '업체 선택' }} />
            <Stack.Screen name="permit-flow/[regionId]/office"             options={{ title: '토목사무소 연결' }} />
          </Stack>
        </AuthLoader>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
