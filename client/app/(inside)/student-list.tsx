import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Student } from "@/types/Student";
import { useAuth } from "@/context/AuthContext";
import { useStudentsByTeacherID } from "@/hooks/useStudents";
import { FlashList } from "@shopify/flash-list";
import Checkbox from "expo-checkbox";

const StudentList = () => {
  const { authInfo } = useAuth();
  const { data, error, isLoading } = useStudentsByTeacherID(authInfo?.id!);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (data) {
      setStudents(data.map((student) => ({ ...student, is_checked: false })));
    }
  }, [data]);

  const handleCheckboxChange = (id: number) => {
    setStudents(
      students.map((student) =>
        student.id === id
          ? { ...student, is_checked: !student.is_checked }
          : student
      )
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size='large' color='#0000ff' />;
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  if (!data || data.length === 0) {
    return <Text>No students found.</Text>;
  }

  console.log(data);
  return (
    <View style={styles.container}>
      <FlashList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={200}
        renderItem={({ item }: { item: Student }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Checkbox
              value={item.is_checked}
              onValueChange={() => handleCheckboxChange(item.id)}
            />
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text>Email: {item.email}</Text>
              <Text>Nama Orang Tua: {item.parent.name}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StudentList;
