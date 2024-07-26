import { useStudentsByClassID } from "@/hooks/useStudents";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

const AttendanceDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: student } = useStudentsByClassID(Number(id));
  console.log(student);
  return (
    <View>
      <Text>AttendanceDetail: {id}</Text>
    </View>
  );
};

export default AttendanceDetail;
