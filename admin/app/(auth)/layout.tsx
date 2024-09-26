import Image from "next/image";
import React from "react";
import Logo from "@/assets/svgs/absenin-high-resolution-logo-transparent.svg";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk - Absenin",
  description: "Masuk untuk menggunakan dashboard Absenin",
};

function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex p-8 bg-gray-400 items-center justify-center w-screen h-screen'>
      <div className='grid lg:grid-cols-2 bg-white shadow-lg rounded-lg max-w-[800px] lg:max-h-[600px] max-h-[400px] w-full h-full divide-x-2 overflow-hidden'>
        <div className='h-full w-full lg:flex items-center justify-center hidden flex-col gap-2 bg-gray-200'>
          <Image
            src={Logo}
            alt='Absenin logo'
            width={200}
            height={200}
            priority
          />
          <h2 className='font-bold text-xl text-[#61777F]'>Panel Dashboard</h2>
        </div>
        <div className='h-full w-full flex items-center justify-center'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
