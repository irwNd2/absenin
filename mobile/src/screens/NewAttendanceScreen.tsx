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
import { useAttendance } from '../hooks/useAttendance';
import { useAuth } from '../contexts/AuthContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { format } from 'date-fns';
import type { Class, Student } from '../types/class';
import axios from 'axios';
import { API_URL } from '../config';
import DateTimePicker from '@react-native-community/datetimepicker';

type NewAttendanceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NewAttendance'>;

const NewAttendanceScreen = () => {
  const navigation = useNavigation<NewAttendanceScreenNavigationProp>();
  const { addAttendance } = useAttendance();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      if (!user?.token) {
        Alert.alert('Error', 'Authentication token is missing');
        return;
      }

      const response = await axios.get(`${API_URL}/api/classes`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
      }
      Alert.alert('Error', 'Failed to fetch classes');
    }
  };

  const fetchStudents = async (className: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/classes/${className}/students`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log('Students response:', response.data);
      // Map the server response to our Student type
      const mappedStudents: Student[] = response.data.map((student: Student) => ({
        ID: student.ID,
        Name: student.Name,
      }));
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
      }
      Alert.alert('Error', 'Failed to fetch students');
    }
  };

  const handleNext = async () => {
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class');
      return;
    }
    if (!selectedSubject) {
      Alert.alert('Error', 'Please select a subject');
      return;
    }
    await fetchStudents(selectedClass.Name);
    setStep(2);
  };

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

    try {
      await addAttendance({
        teacherId: user?.id || '',
        subject: selectedSubject,
        className: selectedClass.Name,
        date: `${format(selectedDate, 'yyyy-MM-dd')}T${format(selectedDate, 'HH:mm')}`,
        students: students.map(student => ({
          studentId: student.ID,
          status: student.status || 'absent',
        })),
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to create attendance record');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      // Keep the selected date but update the time
      const newDate = new Date(selectedDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setSelectedDate(newDate);
    }
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
          {classes.map(classItem => (
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
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{format(selectedDate, 'MMMM d, yyyy')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Hour</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowTimePicker(true)}
        >
          <Text>{format(selectedDate, 'h:mm a')}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[
          styles.button, 
          styles.primaryButton, 
          styles.nextButton,
          (!selectedSubject || !selectedClass) && styles.buttonDisabled
        ]} 
        onPress={handleNext}
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