import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAllSubject } from "@/hooks/useSubject";
import { useAllClasses } from "@/hooks/useClasses";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Subject } from "@/types/Subject";
import { Class } from "@/types/Class";
import { DropdownSelectList } from "@/types/ComponentsProp";
import { SelectList } from "react-native-dropdown-select-list";
import Colors from "@/constants/Colors";

const AddAttendance = () => {
  const { data: subjectList, isLoading: subjectLoading } = useAllSubject();
  const { data: classList, isLoading: classLoading } = useAllClasses();
  const [subjectData, setSubjectData] = useState<DropdownSelectList[] | null>(
    null
  );
  const [classData, setClassData] = useState<DropdownSelectList[] | null>(null);

  useEffect(() => {
    if (subjectList) {
      const newSubject: DropdownSelectList[] = subjectList.map(
        (subject: Subject) => ({
          key: subject.id,
          value: subject.name,
        })
      );
      setSubjectData(newSubject);
    }
    if (classList) {
      const newClass: DropdownSelectList[] = classList.map((cls: Class) => ({
        key: cls.id,
        value: cls.name,
      }));
      setClassData(newClass);
    }
  }, [subjectList, classList]);

  const [selectedSubjectID, setSelectedSubjectID] = useState<number | null>(
    null
  );
  const [selectedClassID, setSelectedClassID] = useState<number | null>(null);

  //   useEffect(() => {
  //     console.log(selectedSubjectID);
  //   }, [selectedSubjectID]);
  if (subjectData && classData) {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Pilih Mata Pelajaran</Text>
          <SelectList
            data={subjectData}
            setSelected={(val: number) => setSelectedSubjectID(val)}
            save='key'
          />
        </View>
        <View>
          <Text style={styles.title}>Pilih Kelas</Text>
          <SelectList
            data={classData}
            setSelected={(val: number) => setSelectedSubjectID(val)}
            save='key'
          />
        </View>
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
});

export default AddAttendance;
