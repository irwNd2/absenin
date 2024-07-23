import "react-native-gesture-handler";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const queryClient = new QueryClient();

const InitialLayout = () => {
  const { authState, initialized, authInfo } = useAuth();
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
      <Stack.Screen
        name='(modals)/add-attendance'
        options={{
          presentation: "modal",
          title: "Tambah Daftar Hadir",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name='close-outline' size={24} />
            </TouchableOpacity>
          ),
        }}
      />
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
