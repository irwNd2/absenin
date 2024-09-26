"use client";

import InputWithLabel from "@/components/ui/custom-input";
import Image from "next/image";
import { useState } from "react";
import ButtonLoader from "@/assets/button-loader.gif";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async () => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    setSubmitting(false);
  };
  return (
    <div className='w-full h-full lg:p-8 p-4 flex flex-col justify-between lg:justify-center lg:-mt-8 gap-3'>
      <h1 className='text-2xl font-bold text-center lg:mt-20'>
        Masukkan email anda untuk mereset password
      </h1>
      <div className='flex flex-col'>
        <form onSubmit={onSubmit}>
          <InputWithLabel
            label='Email'
            labelFor='email'
            type='email'
            value={email}
            setValue={setEmail}
          />
          <Button
            type='submit'
            onClick={onSubmit}
            disabled={!email && !isSubmitting}
            variant={"outline"}
            size={"lg"}
            className=' bg-[#61777F] text-white text-base font-bold mt-2 p-2 w-full h-12 rounded-[8px] hover:bg-[#61777F] hover:text-white'
          >
            {isSubmitting && (
              <Image
                src={ButtonLoader}
                alt='button-loader'
                width={100}
                height={100}
              />
            )}

            {!isSubmitting && <span>Kirim</span>}
          </Button>
        </form>
        <Button
          onClick={() => router.push("/login")}
          variant={"ghost"}
          size={"lg"}
          className='text-[#61777F] text-base font-bold  p-2 w-full h-8  rounded-[8px] hover:bg-white'
        >
          Kembali
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

export default ForgotPasswordPage;
