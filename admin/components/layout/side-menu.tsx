"use client";

import React, { useState } from "react";
import AbseninLogo from "@/assets/absenin-favicon-color.svg";
import Image from "next/image";
import {
  BookOpen,
  CircleUser,
  LayoutDashboard,
  School,
  SquareUserRound,
  UserPen,
  Users,
  Warehouse,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import useActiveMenu from "@/hooks/useActiveMenu";
import { useRouter } from "next/navigation";

type Menu = {
  title: string;
  icon: React.ReactNode;
  path: string;
};
function SideMenu() {
  const [role, setRole] = useState<"admin" | "operator">("admin");

  const superAdminMenu: Menu[] = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard />,
      path: "/",
    },
    {
      title: "Sekolah",
      icon: <School />,
      path: "/sekolah",
    },
    {
      title: "Operator Sekolah",
      icon: <SquareUserRound />,
      path: "/operator-sekolah",
    },
  ];

  const schoolOperator: Menu[] = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard />,
      path: "/",
    },
    {
      title: "Guru",
      path: "/guru",
      icon: <SquareUserRound />,
    },
    {
      title: "Kelas",
      path: "/kelas",
      icon: <Warehouse />,
    },
    {
      title: "Mata Pelajaran",
      path: "/mata-pelajaran",
      icon: <BookOpen />,
    },
    {
      title: "Siswa",
      path: "/siswa",
      icon: <UserPen />,
    },
    {
      title: "Orang Tua Siswa",
      path: "/orang-tua",
      icon: <Users />,
    },
  ];

  const menus = role === "admin" ? superAdminMenu : schoolOperator;
  const activeMenu = useActiveMenu(menus);

  const router = useRouter();

  return (
    <div className='min-h-screen h-full max-w-[270px] w-full flex flex-col bg-gray-200 relative shadow-md p-4'>
      <div className='flex justify-center items-center py-2 border-b border-[#55686f]/20'>
        <Image src={AbseninLogo} width={50} height={50} alt='absenin-logo' />
        <h1 className='font-bold text-lg text-[#55686f]'>Absenin App</h1>
      </div>

      <div className='flex flex-col gap-4 py-6 px-4'>
        {menus.map((el) => {
          return (
            <div
              key={el.path}
              className={`flex gap-2 p-2 ${
                activeMenu?.path === el.path
                  ? "bg-[#55686f] text-white rounded-lg shadow-xl"
                  : ""
              }`}
              role='button'
              onClick={() => router.push(el.path)}
            >
              {el.icon}
              <p>{el.title}</p>
            </div>
          );
        })}
      </div>
      <div className='absolute bottom-3 left-[10%]'>
        <Tabs defaultValue='admin' className='w-full '>
          <TabsList className=''>
            <TabsTrigger value='admin' onClick={() => setRole("admin")}>
              Admin
            </TabsTrigger>
            <TabsTrigger value='operator' onClick={() => setRole("operator")}>
              Operator Sekolah
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className='flex gap-2 items-center mt-4'>
          <CircleUser className='text-[#55686f] w-10 h-10' />
          <div className='flex flex-col '>
            <p className='text-[#55686f] font-bold'>
              {role === "admin" ? "Super Admin" : "Operator Sekolah"}
            </p>
            <h4 className='text-gray-700 text-xs'>admin-test@gmail.com</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
