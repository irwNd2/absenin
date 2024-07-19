import "react-native-gesture-handler";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

const InitialLayout = () => {
  const { authState, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === "(inside)";
    if (authState?.authenticated && !inAuthGroup) {
      setTimeout(() => {
        router.replace("/(inside)");
      }, 100);
    } else if (!authState?.authenticated) {
      router.replace("/");
    }
  }, [authState, initialized]);
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='(inside)' options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView>
          <InitialLayout />
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
