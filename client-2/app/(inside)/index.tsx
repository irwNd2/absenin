import { View, Text, Button } from "react-native";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { TouchableOpacity } from "react-native-gesture-handler";

const InsidePage = () => {
  const { onLogout } = useAuth();

  return (
    <View>
      <Text>Inside Page</Text>
      <TouchableOpacity onPress={onLogout}>
        <Text style={{ color: "red" }}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InsidePage;
