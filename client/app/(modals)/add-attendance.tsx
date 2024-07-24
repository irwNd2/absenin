import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useAllSubject } from "@/hooks/useSubject";
import { useAllClasses } from "@/hooks/useClasses";
import { useEffect, useState } from "react";
import { Subject } from "@/types/Subject";
import { Class } from "@/types/Class";
import Colors from "@/constants/Colors";
import { Dropdown } from "react-native-element-dropdown";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { dateFormat, timeFormat } from "@/utils/time";

const AddAttendance = () => {
  const { data: subjectList } = useAllSubject();
  const { data: classList } = useAllClasses();
  const [subjectData, setSubjectData] = useState<Subject[] | null>(null);
  const [classData, setClassData] = useState<Class[] | null>(null);

  useEffect(() => {
    if (subjectList) setSubjectData(subjectList);
    if (classList) setClassData(classList);
  }, [subjectList, classList]);

  const [selectedSubjectID, setSelectedSubjectID] = useState<number | null>(
    null
  );
  const [selectedClassID, setSelectedClassID] = useState<number | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDateAndroid, setShowDateAndroid] = useState(false);
  const [showTimeAndroid, setShowTimeAndroid] = useState(false);

  const [isFocus, setIsFocus] = useState(false);
  const [isClassFocus, setIsClassFocus] = useState(false);

  useEffect(() => {
    console.log(time);
  }, [time]);

  const onDateChange = (
    { type }: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (type === "set") {
      if (selectedDate) setDate(selectedDate);
      if (showDateAndroid) setShowDateAndroid(!showDateAndroid);
    } else {
      setShowDateAndroid(!showDateAndroid);
    }
  };

  const onTimeChange = (
    { type }: DateTimePickerEvent,
    selectedTime: Date | undefined
  ) => {
    if (type === "set") {
      if (selectedTime) setTime(selectedTime);
      if (showTimeAndroid) setShowTimeAndroid(!showTimeAndroid);
    } else {
      setShowTimeAndroid(!showTimeAndroid);
    }
  };

  if (subjectData && classData) {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Pilih Mata Pelajaran</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={subjectData}
            maxHeight={300}
            labelField='name'
            valueField='id'
            placeholder={!isFocus ? "Pilih dari daftar berikut" : "..."}
            searchPlaceholder='Search...'
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item: Subject) => {
              setSelectedSubjectID(item.id);
              setIsFocus(false);
            }}
          />
        </View>
        <View>
          <Text style={styles.title}>Pilih Kelas</Text>
          <Dropdown
            style={[styles.dropdown, isClassFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={classData}
            search
            maxHeight={300}
            labelField='name'
            valueField='id'
            placeholder={!isClassFocus ? "Pilih dari daftar berikut" : "..."}
            searchPlaceholder='Search...'
            onFocus={() => setIsClassFocus(true)}
            onBlur={() => setIsClassFocus(false)}
            onChange={(item: Class) => {
              setSelectedClassID(item.id);
              setIsClassFocus(false);
            }}
          />
        </View>
        <Text style={styles.title}>Pilih Tanggal</Text>
        {Platform.OS === "ios" && (
          <View style={{ flexDirection: "row" }}>
            <RNDateTimePicker
              minimumDate={new Date()}
              value={date}
              onChange={onDateChange}
            />
            <RNDateTimePicker
              minimumDate={new Date()}
              value={date}
              mode='time'
              onChange={onTimeChange}
            />
          </View>
        )}
        {Platform.OS === "android" && (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={{
                height: 40,
                padding: 10,
                borderRadius: 8,
                backgroundColor: "grey",
              }}
              onPress={() => setShowDateAndroid(true)}
            >
              <Text style={{ color: "white", fontSize: 15, fontWeight: 900 }}>
                {dateFormat(date)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 40,
                padding: 10,
                borderRadius: 8,
                backgroundColor: "grey",
              }}
              onPress={() => setShowTimeAndroid(true)}
            >
              <Text style={{ color: "white", fontSize: 15, fontWeight: 900 }}>
                {timeFormat(time)}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {Platform.OS === "android" && showDateAndroid && (
          <>
            <RNDateTimePicker
              minimumDate={new Date()}
              value={date}
              onChange={onDateChange}
            />
          </>
        )}
        {Platform.OS === "android" && showTimeAndroid && (
          <>
            <RNDateTimePicker
              minimumDate={new Date()}
              value={date}
              mode='time'
              onChange={onTimeChange}
            />
          </>
        )}
        <TouchableOpacity style={styles.buttonConfirm}>
          <Text style={styles.btnText}>Tambah</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    gap: 10,
    position: "relative",
  },
  title: {
    marginBottom: 10,
    fontSize: 20,
  },
  buttonConfirm: {
    borderRadius: 10,
    height: 50,
    backgroundColor: Colors.primary,
    position: "absolute",
    bottom: 40,
    marginLeft: 15,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 20,
    color: "white",
  },

  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default AddAttendance;
