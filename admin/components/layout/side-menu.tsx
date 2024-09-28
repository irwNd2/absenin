"use client";

import AbseninLogo from "@/assets/absenin-favicon-color.svg";
import Image from "next/image";
import {
  BookOpen,
  CircleUser,
  LayoutDashboard,
  LogOut,
  School,
  SquareUserRound,
  UserPen,
  Users,
  Warehouse,
} from "lucide-react";
import useActiveMenu from "@/hooks/useActiveMenu";
import Link from "next/link";
import { Button } from "../ui/button";
import { deleteSession, TokenInfo } from "@/lib/session";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

type Menu = {
  title: string;
  icon: React.ReactNode;
  path: string;
};
function SideMenu() {
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

  const cookie = Cookies.get("jwt");
  const session: TokenInfo = jwtDecode(cookie!);

  const menus = session.role === "Admin" ? superAdminMenu : schoolOperator;
  const activeMenu = useActiveMenu(menus);

  const logout = () => {
    deleteSession();
    Cookies.remove("jwt");
  };

  return (
    <div className='min-h-screen h-full max-w-[270px] w-full flex flex-col bg-gray-200 relative shadow-md p-4'>
      <div className='flex justify-center items-center py-2 border-b border-[#55686f]/20'>
        <Image src={AbseninLogo} width={50} height={50} alt='absenin-logo' />
        <div className='flex flex-col'>
          <h1 className='font-bold text-lg text-[#55686f]'>Absenin App</h1>
          <p className='text-[9px] -mt-1 text-gray-500'>
            Monitor siswa dalam satu aplikasi
          </p>
        </div>
      </div>
      <div className='flex flex-col justify-between flex-grow'>
        <div className='flex flex-col gap-4 py-6 px-4'>
          {menus.map((el) => {
            return (
              <Link
                key={el.path}
                className={`flex gap-2 p-2 font-semibold ${
                  activeMenu?.path === el.path
                    ? "bg-[#55686f]/60 text-white rounded-lg shadow-xl"
                    : ""
                }`}
                role='button'
                href={el.path}
              >
                {el.icon}
                <p>{el.title}</p>
              </Link>
            );
          })}
        </div>
        <div className=' flex justify-between items-center'>
          <div className='flex gap-2 items-center'>
            <CircleUser className='text-[#55686f] w-10 h-10' />
            <div className='flex flex-col '>
              <p className='text-[#55686f] font-bold'>
                {session.role === "Admin" ? "Admin" : "Operator Sekolah"}
              </p>
              <h4 className='text-gray-700 text-xs -mt-0.5'>{session.name}</h4>
            </div>
          </div>
          <Button
            variant={"ghost"}
            className='flex p-0 hover:bg-transparent'
            title='Keluar'
            onClick={logout}
          >
            <LogOut className='h-6 text-red-600/60' />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
