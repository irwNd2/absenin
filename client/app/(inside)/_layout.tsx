import { router, Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { Text, TouchableOpacity } from "react-native";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { UpdateExpoTokenPayload } from "@/types/ExpoToken";
import { updateExpoToken } from "@/api/expoToken";

const InsideLayout = () => {
  const { onLogout, authState, authInfo } = useAuth();
  const payload: UpdateExpoTokenPayload = {
    expo_token: null,
    user_id: authInfo?.id!,
    user_type: authInfo?.role?.toLocaleLowerCase()!,
  };
  const mutate = useMutation({
    mutationFn: updateExpoToken,
  });
  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
      mutate.mutate(payload);
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTitleStyle: {
          fontFamily: "mon-bold",
          fontSize: 18,
        },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Beranda",
          tabBarLabelStyle: {
            fontFamily: "mon-bold",
          },
          tabBarIcon: ({ color, size }) => {
            return <Feather name='home' size={size} color={color} />;
          },
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={handleLogout}
            >
              <Ionicons name='log-out-outline' size={24} color='pink' />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name='student-list'
        options={{
          href: authState?.user_id?.includes("teacher")
            ? "/student-list"
            : null,
          title: "Daftar Siswa",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name='person' size={size} color={color} />;
          },
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name='attendance-list'
        options={{
          href: authState?.user_id?.includes("teacher")
            ? "/attendance-list"
            : null,
          title: "Daftar Absen",
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome name='list-ul' size={size} color={color} />;
          },
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => router.navigate("(modals)/add-attendance")}
            >
              {/* <Entypo name='add-to-list' size={30} color='black' /> */}
              <Text
                style={{ fontFamily: "mon-bold", fontSize: 18, color: "white" }}
              >
                Tambah
              </Text>
            </TouchableOpacity>
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
};

export default InsideLayout;
