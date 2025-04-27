import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { format } from 'date-fns';
import type { Class, Student } from '../types/class';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getClasses, getStudentsInClass } from '../services/classes';
import { AttendancePayload, createAttendance } from '../services/attendance';

type NewAttendanceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NewAttendance'>;

const NewAttendanceScreen = () => {
  const navigation = useNavigation<NewAttendanceScreenNavigationProp>();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());

  const queryClient = useQueryClient()
  const { mutate: mutateAttendance } = useMutation({
    mutationFn: (attendance: AttendancePayload) => createAttendance(attendance), 
    onSuccess: () => {
      Alert.alert('Success', 'Attendance created successfully!');
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'An error occurred while creating attendance.');
    },
  })

  const { data: classes, isFetching: isClassLoading } = useQuery({ queryKey: ['classes'], queryFn: getClasses });

  const { data: studentData } = useQuery({ queryKey: ['students'], queryFn: () => getStudentsInClass(selectedClass?.ID!), enabled: !!selectedClass?.ID && step === 2, });

  useEffect(() => {
    if (studentData) {
      setStudents(studentData);
    }
  }, [studentData])

  const handleStudentStatusChange = (studentId: string, status: 'present' | 'sick' | 'absent') => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.ID === studentId ? { ...student, status } : student
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSubject) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const hasUnmarkedStudents = students.some(student => !student.status);
    if (hasUnmarkedStudents) {
      Alert.alert('Error', 'Please mark attendance for all students');
      return;
    }

    mutateAttendance({
        teacherId: user?.id || '',
        subject: selectedSubject,
        className: selectedClass.Name,
        date: `${format(selectedDate, 'yyyy-MM-dd')}T${format(selectedTime, 'HH:mm')}`,
        students: students.map(student => ({
          studentId: student.ID,
          status: student.status || 'absent',
        })),
      });
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 1: Select Class and Subject</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Subject</Text>
        <View style={styles.subjectsContainer}>
          {user?.subjects?.map(subject => (
            <TouchableOpacity
              key={subject}
              style={[
                styles.subjectButton,
                selectedSubject === subject && styles.subjectButtonActive,
              ]}
              onPress={() => setSelectedSubject(subject)}
            >
              <Text
                style={[
                  styles.subjectButtonText,
                  selectedSubject === subject && styles.subjectButtonTextActive,
                ]}
              >
                {subject}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Class</Text>
        <View style={styles.classesContainer}>
          {classes?.map((classItem: Class) => (
            <TouchableOpacity
              key={classItem.ID}
              style={[
                styles.classButton,
                selectedClass?.ID === classItem.ID && styles.classButtonActive,
              ]}
              onPress={() => setSelectedClass(classItem)}
            >
              <Text
                style={[
                  styles.classButtonText,
                  selectedClass?.ID === classItem.ID && styles.classButtonTextActive,
                ]}
              >
                {classItem.Name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Date</Text>
        <View style={{ flexDirection: 'row'}}>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(_, date) => setSelectedDate(date!)}
            />
          <DateTimePicker
            value={selectedTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(_, time) => setSelectedTime(time!)}
            />
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.button, 
          styles.primaryButton, 
          styles.nextButton,
          (!selectedSubject || !selectedClass) && styles.buttonDisabled
        ]} 
        onPress={() => setStep(2)}
        disabled={!selectedSubject || !selectedClass}
      >
        <Text style={[
          styles.buttonText,
          (!selectedSubject || !selectedClass) && styles.buttonTextDisabled
        ]}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => {
    const allStudentsMarked = students.every(student => student.status);

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Step 2: Mark Student Attendance</Text>
        
        {students.map(student => (
          <View key={student.ID} style={styles.studentCard}>
            <Text style={styles.studentName}>{student.Name}</Text>
            <View style={styles.statusButtons}>
              {(['present', 'sick', 'absent'] as const).map(status => (
                <TouchableOpacity
                  key={`${student.ID}-${status}`}
                  style={[
                    styles.statusButton,
                    student.status === status && {
                      backgroundColor: getStatusColor(status),
                    },
                  ]}
                  onPress={() => handleStudentStatusChange(student.ID, status)}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      student.status === status && styles.statusButtonTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.step2Buttons}>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => setStep(1)}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.button, 
              styles.primaryButton,
              !allStudentsMarked && styles.buttonDisabled
            ]} 
            onPress={handleSubmit}
            disabled={!allStudentsMarked}
          >
            <Text style={[
              styles.buttonText,
              !allStudentsMarked && styles.buttonTextDisabled
            ]}>Create Attendance</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getStatusColor = (status: 'present' | 'sick' | 'absent') => {
    switch (status) {
      case 'present':
        return '#4CAF50';
      case 'sick':
        return '#FFC107';
      case 'absent':
        return '#FF5252';
      default:
        return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>New Attendance</Text>
      </View>
      <ScrollView style={styles.content}>
        {step === 1 ? renderStep1() : renderStep2()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  subjectButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  subjectButtonText: {
    fontSize: 14,
    color: '#666',
  },
  subjectButtonTextActive: {
    color: '#fff',
  },
  classesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  classButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  classButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  classButtonText: {
    fontSize: 14,
    color: '#666',
  },
  classButtonTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  studentCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  studentName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  step2Buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  nextButton: {
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonTextDisabled: {
    color: '#666',
  },
});

export default NewAttendanceScreen; 