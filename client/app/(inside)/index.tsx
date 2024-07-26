import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { usePushNotification } from "@/hooks/usePushNotification";
import { useAuth } from "@/context/AuthContext";
import { updateExpoToken } from "@/api/expoToken";
import { useMutation } from "@tanstack/react-query";
import { UpdateExpoTokenPayload } from "@/types/ExpoToken";
import { router } from "expo-router";

const InsidePage = () => {
  const { authInfo } = useAuth();
  const { expoPushToken } = usePushNotification();
  const payload: UpdateExpoTokenPayload = {
    expo_token: expoPushToken?.data!,
    user_id: authInfo?.id!,
    user_type: authInfo?.role?.toLocaleLowerCase()!,
  };
  const mutate = useMutation({
    mutationFn: updateExpoToken,
  });

  useEffect(() => {
    if (expoPushToken?.data) {
      mutate.mutate(payload);
    } else {
      console.log("Expo token not found. Use Physical device");
    }
  }, [expoPushToken]);
  return (
    <View style={style.container}>
      <Text style={style.title}>Selamat datang {authInfo?.name}</Text>
      <TouchableOpacity onPress={() => router.navigate("/attendance/1")}>
        <Text>To Attendance detail</Text>
      </TouchableOpacity>
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
