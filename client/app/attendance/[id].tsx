import { useStudentsByClassID } from "@/hooks/useStudents";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import useStudentAttendanceStore from "@/store/attendance";
import { FlashList } from "@shopify/flash-list";
import { CheckBox } from "@rneui/themed";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";
import {
  StudentAttendanceDetail,
  StudentAttendanceDetailPayload,
} from "@/types/Class";
import { sendNotification } from "@/api/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKey from "@/constants/QueryKey";
import Spinner from "react-native-loading-spinner-overlay";
import { StudentByClassID } from "@/types/Student";

const AttendanceDetail = () => {
  const classID = useStudentAttendanceStore((state) => state.classID);
  const [studentDetail, setStudentDetail] = useState<StudentAttendanceDetail[]>(
    []
  );

  const attendanceDetails = useStudentAttendanceStore(
    (state) => state.studentAttendanceDetails
  );

  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: student } = useStudentsByClassID(classID!);

  useEffect(() => {
    if (student) {
      setStudentDetail(
        student.map((student) => ({
          student_attendance_id: Number(id),
          student_id: student.id,
          is_present: false,
          reason: null,
          name: student.name,
          nisn: student.nisn,
        }))
      );
    }
  }, [student]);

  const handleCheckBoxChange = (id: number) => {
    setStudentDetail(
      studentDetail.map((student) =>
        student.student_id === id
          ? { ...student, is_present: !student.is_present }
          : student
      )
    );
  };

  const send = useMutation({
    mutationFn: (payload: StudentAttendanceDetailPayload[]) =>
      sendNotification(payload),
  });

  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    const payload: StudentAttendanceDetailPayload[] = [];
    studentDetail.forEach((item) => {
      const p: StudentAttendanceDetailPayload = {
        student_attendance_id: item.student_attendance_id,
        student_id: item.student_id,
        is_present: item.is_present,
        reason: item.reason,
      };
      payload.push(p);
    });

    send.mutate(payload, {
      onSuccess: () => {
        setLoading(false);
        setTimeout(() => {
          router.replace("/(inside)/attendance-list");
        }, 100);
        queryClient.invalidateQueries({
          queryKey: [QueryKey.allAttendanceByTeacher],
        });
      },
      onError: (err) => {
        setLoading(false);
        console.log(err);
      },
    });
  };

  if (!attendanceDetails || attendanceDetails.length === 0) {
    return (
      <View style={styles.container}>
        <Spinner visible={loading} />
        <Text style={{ fontFamily: "mon-semi", marginBottom: 10 }}>
          <Text>Berikut adalah daftar siswa di kelas ini. Silahkan</Text>
          <Text style={{ fontStyle: "italic" }}> check list</Text>
          <Text> nama siswa di bawah jika hadir.</Text>
        </Text>

        <FlashList
          data={studentDetail}
          keyExtractor={(item) => item.student_id.toString()}
          estimatedItemSize={100}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text style={{ fontFamily: "mon-semi" }}>{item.name}</Text>
                <Text style={{ fontFamily: "mon", fontSize: 10 }}>
                  NISN: {item.nisn}
                </Text>
              </View>
              <CheckBox
                size={23}
                checked={item.is_present}
                onPress={() => handleCheckBoxChange(item.student_id)}
                containerStyle={{ backgroundColor: "transparent" }}
              />
            </View>
          )}
        />

        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnTitle}>Konfirmasi Kehadiran</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const studentMap: { [key: number]: StudentByClassID } = {};
  student?.forEach((student) => {
    studentMap[student.id] = student;
  });

  const mergedData: StudentAttendanceDetail[] = attendanceDetails?.map(
    (att) => {
      const student = studentMap[att.student_id];
      return {
        ...att,
        name: student ? student.name : "Unknown",
        nisn: student ? student.nisn : "Unknown",
      };
    }
  );

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: "mon-semi", marginBottom: 10 }}>
        <Text>
          Berikut adalah daftar siswa yang hadir dan tidak hadir di absen ini
        </Text>
      </Text>

      <FlashList
        data={mergedData}
        keyExtractor={(item, index) => `${item.student_id}-${index}`}
        estimatedItemSize={100}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontFamily: "mon-semi" }}>{item.name}</Text>
              <Text style={{ fontFamily: "mon", fontSize: 10 }}>
                NISN: {item.nisn}
              </Text>
            </View>
            <Text style={{ color: item.is_present ? "green" : "red" }}>
              {item.is_present ? "Hadir" : "Tidak Hadir"}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    height: "auto",
  },
  btn: {
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTitle: {
    fontFamily: "mon-bold",
    fontSize: 22,
    color: "white",
  },
});

export default AttendanceDetail;
