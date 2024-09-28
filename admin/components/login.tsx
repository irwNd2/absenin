"use client";
import { useEffect, useState } from "react";
import InputWithLabel from "./ui/custom-input";
import { Button } from "./ui/button";
import ButtonLoader from "@/assets/button-loader.gif";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useRouter } from "next/navigation";
import { useLogin } from "@/lib/react-query/useAuth";
import { LoginPayload } from "@/lib/api/auth";
import { createSession } from "@/lib/session";
import Cookies from "js-cookie";

function LoginComponent() {
  const [role, setRole] = useState<"Admin" | "Operator">("Admin");
  const router = useRouter();

  return (
    <div className='flex flex-col justify-between lg:justify-start lg:p-8 p-4 w-full h-full'>
      <h1 className='text-2xl font-bold text-center lg:mt-20'>
        Selamat Datang di Panel Dashboard Absenin
      </h1>
      <div className='flex flex-col'>
        <Tabs defaultValue='admin' className='w-full lg:mt-5'>
          <TabsList className=''>
            <TabsTrigger value='admin' onClick={() => setRole("Admin")}>
              Admin
            </TabsTrigger>
            <TabsTrigger value='operator' onClick={() => setRole("Operator")}>
              Operator Sekolah
            </TabsTrigger>
          </TabsList>
          <UserForm role={role} />
        </Tabs>
        <Button
          onClick={() => router.push("/forgot-password")}
          variant={"ghost"}
          size={"lg"}
          className='text-[#61777F] text-base font-bold p-2 w-full h-8 -mt-1 rounded-[8px] hover:bg-white'
        >
          Lupa password?
        </Button>
      </div>
      <div className='lg:hidden flex'>
        <p className='text-xs'>
          Buka menggunakan komputer atau laptop untuk visual dan fungsionalitas
          yg maksimal
        </p>
      </div>
    </div>
  );
}

type FormProps = {
  role: "Admin" | "Operator";
};

const UserForm = ({ role }: FormProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const form = email && password;
    setIsFormCompleted(!!form);
  }, [email, password]);

  const { mutate: login } = useLogin();

  const onLogin = async () => {
    setSubmitting(true);
    setIsFormCompleted(false);
    const payload: LoginPayload = {
      email,
      password,
      role,
    };

    login(payload, {
      onSuccess: async (data) => {
        await createSession(data?.access_token);
        Cookies.set("jwt", data?.access_token)
        setSubmitting(false);
        setIsFormCompleted(true);
      },
      onError: () => {
        setSubmitting(false);
        setIsFormCompleted(true);
      },
    });
  };

  return (
    <form onSubmit={onLogin}>
      <div className='flex flex-col gap-3 mt-4'>
        <InputWithLabel
          label='Email'
          labelFor='email'
          type='email'
          value={email}
          setValue={setEmail}
        />
        <InputWithLabel
          label='Password'
          labelFor='password'
          type='password'
          value={password}
          setValue={setPassword}
        />
        <Button
          type='submit'
          onClick={onLogin}
          disabled={!isFormCompleted}
          variant={"outline"}
          size={"lg"}
          className=' bg-[#61777F] z-[1] text-white text-base font-bold mt-1 p-2 w-full h-12 rounded-[8px] hover:bg-[#61777F] hover:text-white'
        >
          {isSubmitting && (
            <Image
              src={ButtonLoader}
              alt='button-loader'
              width={100}
              height={100}
            />
          )}

          {!isSubmitting && <span>Login</span>}
        </Button>
      </div>
    </form>
  );
};

export default LoginComponent;
