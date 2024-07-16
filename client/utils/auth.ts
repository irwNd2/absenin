import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("accessToken", token);
  } catch (error) {
    console.error("failed to store token", error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    return token;
  } catch (error) {
    console.error("failed to get token", error);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("accessToken");
  } catch (e) {
    console.error("Failed to remove the token.", e);
  }
};
