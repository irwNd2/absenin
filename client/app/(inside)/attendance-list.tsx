import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AttendanceList = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text>AttendanceList</Text>
      <View style={styles.addIcon}>
        <TouchableOpacity
          onPress={() => router.navigate("(modals)/add-attendance")}
        >
          <Entypo name='add-to-list' size={34} color='black' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  addIcon: {
    position: "absolute",
    right: 20,
    bottom: 10,
  },
});

export default AttendanceList;
