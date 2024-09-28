import { useMutation } from "@tanstack/react-query";
import { login, type LoginPayload } from "../api/auth";

export const useLogin = () =>
  useMutation({ mutationFn: (payload: LoginPayload) => login(payload) });
