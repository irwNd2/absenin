import React from "react";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

const InsideLayout = () => {
  const { onLogout, authState } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Beranda",

          tabBarIcon: ({ color, size }) => {
            return <Feather name='home' size={size} color={color} />;
          },
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 10 }} onPress={onLogout}>
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
    </Tabs>
  );
};

export default InsideLayout;
