import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { usePushNotification } from "@/hooks/usePushNotification";
import { useAuth } from "@/context/AuthContext";

const InsidePage = () => {
  const { authInfo, authState } = useAuth();
  const { expoPushToken, notification } = usePushNotification();

  console.log(expoPushToken?.data);
  console.log(authInfo, authState);
  return (
    <View style={style.container}>
      <Text style={style.title}>Selamat datang {authInfo?.name}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontStyle: "normal",
  },
});

export default InsidePage;
