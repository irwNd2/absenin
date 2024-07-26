import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAttendance } from "@/hooks/useAttendance";
import { FlashList } from "@shopify/flash-list";
import { StudentAttendance } from "@/types/Student";
import Divider from "@/components/Divider";
import Colors from "@/constants/Colors";
import { formatDateWithDayName, getHour } from "@/utils/time";

const AttendanceList = () => {
  const { data: attendanceData } = useAttendance();

  const router = useRouter();

  if (!attendanceData) {
    return (
      <View style={[styles.container, { padding: 20 }]}>
        <Text style={{ fontFamily: "mon-semi" }}>
          Belum ada absen yg dibuat
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {attendanceData && (
        <FlashList
          data={attendanceData}
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={200}
          renderItem={({ item }: { item: StudentAttendance }) => (
            <TouchableOpacity
              style={styles.listContainer}
              onPress={() => router.navigate(`/attendance/${item.id}`)}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <MaterialIcons
                    name='meeting-room'
                    size={24}
                    color={Colors.primary}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: "mon-bold",
                    }}
                  >
                    {item.student_class.name}
                  </Text>
                </View>
                <Entypo name='chevron-small-right' size={24} color='black' />
              </View>
              <Text style={{ color: "grey", fontFamily: "mon" }}>
                {formatDateWithDayName(item.time)} • {getHour(item.time)}
              </Text>
              <Text style={{ color: "grey", fontFamily: "mon" }}>
                Mata Pelajaran • {item.subject.name}
              </Text>
              <Divider />
              <Text style={{ color: "grey", fontFamily: "mon-semi" }}>
                {item.student_attendance ? "Selesai" : "Belum Selesai"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#f2f2f2",
    // alignItems: "center",
    fontFamily: "mon-semi",
  },
  addIcon: {
    right: 20,
    bottom: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 10,
    height: "auto",
    borderRadius: 8,
    width: "95%",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    backgroundColor: "white",
    gap: 5,
    // elevation: 10,
  },
});

export default AttendanceList;
