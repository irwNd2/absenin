import React, { useEffect, useState } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAttendance } from '../hooks/useAttendance';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { format } from 'date-fns';
import type { AttendanceStatus } from '../types/attendance';

type EditAttendanceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditAttendance'>;
type EditAttendanceScreenRouteProp = RouteProp<RootStackParamList, 'EditAttendance'>;

const EditAttendanceScreen = () => {
  const navigation = useNavigation<EditAttendanceScreenNavigationProp>();
  const route = useRoute<EditAttendanceScreenRouteProp>();
  const { attendances, updateAttendanceRecord } = useAttendance();
  const [attendance, setAttendance] = useState(attendances.find(a => a.id === route.params.id));

  useEffect(() => {
    setAttendance(attendances.find(a => a.id === route.params.id));
  }, [attendances, route.params.id]);

  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    if (!attendance) return;

    const updatedStudents = attendance.students.map(student =>
      student.id === studentId
        ? { ...student, status: newStatus }
        : student
    );

    setAttendance({
      ...attendance,
      students: updatedStudents,
    });
  };

  const handleSave = async () => {
    if (!attendance) return;

    try {
      await updateAttendanceRecord(attendance.id, attendance);
      Alert.alert('Success', 'Attendance updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update attendance');
    }
  };

  if (!attendance) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: AttendanceStatus) => {
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
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Class:</Text>
            <Text style={styles.infoValue}>{attendance.className}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Subject:</Text>
            <Text style={styles.infoValue}>{attendance.subject}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>
              {format(new Date(attendance.date), 'MMM dd, yyyy')}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Students</Text>
        {attendance.students.map(student => (
          <View key={student.id} style={styles.studentCard}>
            <Text style={styles.studentName}>{student.name}</Text>
            <View style={styles.statusButtons}>
              {(['present', 'sick', 'absent'] as AttendanceStatus[]).map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    student.status === status && {
                      backgroundColor: getStatusColor(status),
                    },
                  ]}
                  onPress={() => handleStatusChange(student.studentId, status)}
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
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
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
});

export default EditAttendanceScreen; 