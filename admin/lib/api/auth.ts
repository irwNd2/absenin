import axios from "axios";

export type LoginPayload = {
  email: string;
  password: string;
  role: "Admin" | "Operator";
};

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export const login = async (payload: LoginPayload) => {
  const res = await axios.post(`${API_URL}/admin/login`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data.data;
};
