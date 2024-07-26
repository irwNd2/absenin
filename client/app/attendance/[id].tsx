import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

const AttendanceDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>AttendanceDetail: {id}</Text>
    </View>
  );
};

export default AttendanceDetail;
