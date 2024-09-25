"use client";
import { useEffect, useState } from "react";
import InputWithLabel from "./ui/custom-input";
import { Button } from "./ui/button";
import ButtonLoader from "@/assets/button-loader.gif";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type FormProps = {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  isFormCompleted: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
};

const Form = ({
  email,
  setEmail,
  password,
  setPassword,
  isFormCompleted,
  isSubmitting,
  onSubmit,
}: FormProps) => {
  return (
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
        onClick={onSubmit}
        disabled={!isFormCompleted}
        variant={"outline"}
        size={"lg"}
        className=' bg-[#61777F] text-white text-base font-bold mt-1 p-2 w-full h-12 rounded-[8px] hover:bg-[#61777F] hover:text-white'
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
  );
};

function LoginComponent() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const form = email && password;
    setIsFormCompleted(!!form);
  }, [email, password]);

  const onLogin = async () => {
    setSubmitting(true);
    setIsFormCompleted(false);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    setSubmitting(false);
    setIsFormCompleted(true);
  };

  const [role, setRole] = useState<"admin" | "operator">("admin");

  return (
    <div className='flex flex-col gap-3 px-8 w-full'>
      <h1 className='-mt-8 text-2xl font-bold text-center'>
        Selamat Datang di Panel Dashboard Absenin
      </h1>

      <Tabs defaultValue='admin' className='w-full mt-4'>
        <TabsList className=''>
          <TabsTrigger value='admin' onClick={() => setRole("admin")}>
            Admin
          </TabsTrigger>
          <TabsTrigger value='operator' onClick={() => setRole("operator")}>
            Operator Sekolah
          </TabsTrigger>
        </TabsList>
        <TabsContent value='admin'>
          <Form
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isSubmitting={isSubmitting}
            isFormCompleted={isFormCompleted}
            onSubmit={onLogin}
          />
        </TabsContent>
        <TabsContent value='operator'>
          {" "}
          <Form
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isSubmitting={isSubmitting}
            isFormCompleted={isFormCompleted}
            onSubmit={onLogin}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LoginComponent;
