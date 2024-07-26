import "react-native-gesture-handler";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TouchableOpacity } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();
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
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "mon-bold",
          color: "white",
        },
      }}
    >
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
      <Stack.Screen
        name='attendance/[id]'
        options={{
          title: "Absen Kelas",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo name='chevron-left' size={24} color='white' />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.primary,
          },
        }}
      />
    </Stack>
  );
};

const RootLayout = () => {
  const [loaded, error] = useFonts({
    mon: require("../assets/fonts/Montserrat-Regular.ttf"),
    "mon-bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "mon-semi": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    ...FontAwesome.font,
  });
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

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
