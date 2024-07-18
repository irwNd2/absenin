import { useState } from "react";
import { View, Text, Button, TextInput, SafeAreaView } from "react-native";
import { login } from "../../actions/login";
import { router } from "expo-router";

const Login = () => {
  const [accountType, setAccountType] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const account: Record<string, string> = {
    teacher: "Guru",
    student: "Siswa",
    parent: "Orang Tua",
  };

  const handleLogin = async () => {
    setError("");
    try {
      await login({ email, password, type: accountType });
      router.navigate("/");
    } catch (error) {
      setError("Gagal login. Periksa kembali email/password anda");
    }
  };

  return (
    <SafeAreaView className='flex items-center justify-center h-full flex-col'>
      <Text className='text-2xl font-bold mb-2'>
        Masuk {accountType ? `Sebagai ${account[accountType]}` : ""}
      </Text>

      {!accountType && (
        <>
          <View className='flex flex-col gap-1'>
            <View className='rounded bg-blue-400 w-[300px]'>
              <Button
                title='Guru'
                color='black'
                onPress={() => setAccountType("teacher")}
              />
            </View>
            <View className='rounded bg-blue-400 w-[300px]'>
              <Button
                title='Siswa'
                color='black'
                onPress={() => setAccountType("student")}
              />
            </View>
            <View className='rounded bg-blue-400 w-[300px]'>
              <Button
                title='Orang Tua'
                color='black'
                onPress={() => setAccountType("parent")}
              />
            </View>
          </View>
        </>
      )}
      {accountType && (
        <>
          <SafeAreaView className='flex flex-col gap-1'>
            <TextInput
              value={email}
              placeholder='Masukkan email anda'
              className='h-10 border bg-slate-400 rounded p-2 w-[300px]'
              keyboardType='email-address'
              onChangeText={setEmail}
              placeholderTextColor={"black"}
            />
            <TextInput
              value={password}
              secureTextEntry
              placeholder='Masukkan password anda'
              className='h-10 w-[300px] border bg-slate-400 rounded p-2'
              onChangeText={setPassword}
              placeholderTextColor={"black"}
            />
            {error ? <Text className='text-red-700 ml-2'>{error}</Text> : null}

            <View className='w-[300px] border rounded bg-blue-400'>
              <Button title='Masuk' color='#000000' onPress={handleLogin} />
            </View>
            <View className='w-[300px] border rounded'>
              <Button title='Kembali' onPress={() => setAccountType("")} />
            </View>
          </SafeAreaView>
        </>
      )}
    </SafeAreaView>
  );
};

export default Login;
