import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Student } from "@/types/Student";
import { useAuth } from "@/context/AuthContext";
import { useStudentsByTeacherID } from "@/hooks/useStudents";
import { FlashList } from "@shopify/flash-list";
import Checkbox from "expo-checkbox";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { SendNotificationPayload } from "@/types/Notification";
import { useMutation } from "@tanstack/react-query";
import { sendNotification } from "@/api/notification";

const StudentList = () => {
  const { authInfo } = useAuth();
  const { data, error, isLoading, refetch } = useStudentsByTeacherID(
    authInfo?.id!
  );
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

  const sendNotif = useMutation({
    mutationFn: (payload: SendNotificationPayload[]) =>
      sendNotification(payload),
  });

  const confirm = () => {
    const payload: SendNotificationPayload[] = [];
    students.forEach((student: Student) => {
      const notif: SendNotificationPayload = {
        to: student.parent.expo_token ? student.parent.expo_token : null,
        title: "Kehadiran Siswa",
        body: student.is_checked
          ? `Anak anda ${student.name} hadir di sekolah hari ini`
          : `Anak anda ${student.name} tidak hadir di sekolah hari ini`,
        user_id: `parent-${student.parent.id}`,
      };
      payload.push(notif);
    });
    sendNotif.mutate(payload);
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  if (!data || data.length === 0) {
    return <Text>No students found.</Text>;
  }

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
              <Text>Orang Tua: {item.parent.name}</Text>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={[styles.confirmButton, { marginBottom: 10 }]}
        onPress={refetch}
      >
        <Text style={styles.textConfirm}>Manual Reload</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.confirmButton} onPress={confirm}>
        <Text style={styles.textConfirm}>Konfirmasi Kehadiran</Text>
      </TouchableOpacity>
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
  confirmButton: {
    padding: 20,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  textConfirm: {
    textAlign: "center",
    fontSize: 20,
    color: "white",
  },
});

export default StudentList;
