import { useStudentsByClassID } from "@/hooks/useStudents";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import useStudentAttendanceStore from "@/store/attendance";

const AttendanceDetail = () => {
  const subjectID = useStudentAttendanceStore((state) => state.subjectID);
  const classID = useStudentAttendanceStore((state) => state.classID);

  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: student } = useStudentsByClassID(classID!);
  console.log(student);
  return (
    <View>
      <Text>AttendanceDetail: {id}</Text>
      <Text>Class ID: {classID}</Text>
      <Text>Subject ID: {subjectID}</Text>
    </View>
  );
};

export default AttendanceDetail;
