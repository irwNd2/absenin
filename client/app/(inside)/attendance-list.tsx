import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAttendance } from "@/hooks/useAttendance";
import { FlashList } from "@shopify/flash-list";
import { StudentAttendance } from "@/types/Student";

const AttendanceList = () => {
  const { data: attendanceData } = useAttendance();

  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text>AttendanceList</Text>
      {attendanceData && (
        <FlashList
          data={attendanceData}
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={200}
          renderItem={({ item }: { item: StudentAttendance }) => (
            <TouchableOpacity
              style={{
                marginBottom: 16,
                height: 60,
                backgroundColor: "grey",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: 10,
                position: "relative",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <Text>
                  {item.subject.name} {item.student_class.name}
                </Text>

                <View
                  style={{
                    alignItems: "flex-end",
                    flexDirection: "column",
                    position: "absolute",
                    left: 260,
                    marginBottom: 10,
                  }}
                >
                  <Text>Status</Text>
                  {!item.student_attendance && (
                    <Text style={{ color: "yellow" }}>Belum Selesai</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
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
