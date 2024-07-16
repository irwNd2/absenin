import axios from "axios";
import { storeToken } from "@/utils/auth";

export type LoginPayload = {
  email: string;
  password: string;
  type: string;
};

export const login = async (payload: LoginPayload) => {
  const url = `http://192.168.1.136:3000/v1/${payload.type}/login`;
  try {
    const response = await axios.post(url, {
      email: payload.email,
      password: payload.password,
    });
    const token = response.data.data?.access_token;
    await storeToken(token);
    console.log(token);
    return token;
  } catch (error) {
    console.log(error, url);
    throw error;
  }
};
