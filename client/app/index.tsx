import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { TextInput } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { onLogin } = useAuth();

  const [role, setRole] = useState<"teacher" | "student" | "parent" | null>(
    null
  );

  const onSigninPress = async () => {
    if (!role) {
      Alert.alert("Error", "Please select a role.");
      return;
    }
    setLoading(true);
    try {
      await onLogin!(email, password, role!);
    } catch (error) {
      Alert.alert("Error", "Cant login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Spinner visible={loading} />
      {!role && (
        <>
          <Text style={styles.header}>Selamat Datang di Absenin</Text>
          <Text style={styles.subtitle}>Pilih jenis akun di bawah</Text>
          <TouchableOpacity
            style={[styles.roleButton, { backgroundColor: Colors.primary }]}
            onPress={() => setRole("teacher")}
          >
            <Text style={styles.roleText}>Guru</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, { backgroundColor: Colors.primary }]}
            onPress={() => setRole("student")}
          >
            <Text style={styles.roleText}>Siswa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, { backgroundColor: Colors.primary }]}
            onPress={() => setRole("parent")}
          >
            <Text style={styles.roleText}>Orang Tua</Text>
          </TouchableOpacity>
        </>
      )}

      {role && (
        <>
          <Text style={styles.header}>Login</Text>
          <Text>
            {role === "parent"
              ? "Ini deskripsi orang tua"
              : role === "student"
              ? "Ini deskripsi untuk siswa"
              : "Ini deskripsi untuk guru"}
          </Text>
          <TextInput
            placeholder='Masukkan email'
            value={email}
            onChangeText={setEmail}
            style={styles.inputField}
            placeholderTextColor='#999896'
            inputMode='email'
          />
          <TextInput
            placeholder='Masukkan password'
            value={password}
            onChangeText={setPassword}
            style={styles.inputField}
            placeholderTextColor='#999896'
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.roleButton, { backgroundColor: Colors.primary }]}
            onPress={onSigninPress}
          >
            <Text style={[styles.roleText, { color: "white" }]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => setRole(null)}
          >
            <Text style={{ color: Colors.primary }}>Kembali</Text>
          </TouchableOpacity>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 20,
    fontSize: 40,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 30,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
  },
  roleButton: {
    padding: 8,
    borderRadius: 8,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
  },
  roleText: {
    fontSize: 20,
  },
});

export default Page;
