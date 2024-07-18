import {
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  Button,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { removeToken, getToken } from "@/utils/auth";
// import { jwtDecode } from "jwt-decode";

export default async function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (token) {
        setIsLoggedIn(true);
      } else {
        router.replace("/login");
      }
      setLoading(false);
    };

    checkToken();
  }, [router]);

  const handleLogout = async () => {
    await removeToken();
    router.replace("/login");
  };

  // const token = await getToken();
  // const decodedToken = jwtDecode(token as string);
  // console.log(decodedToken);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (isLoggedIn) {
    return (
      <SafeAreaView>
        <View className='p-4 flex flex-col items-center justify-between h-full'>
          <View>
            <Text>Home Screen</Text>
          </View>
          <View className='w-[300px] bg-red-200 h-10 rounded flex items-center justify-center'>
            <Button title='Keluar' color='red' onPress={handleLogout} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}
