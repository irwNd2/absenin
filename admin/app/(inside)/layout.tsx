import { Metadata } from "next";
import SideMenu from "@/components/layout/side-menu";
import InsideWrapperPage from "@/components/layout/wrapper";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Admin Panel - Absenin",
  description: "Selamat datang di dalam dashboard Absenin",
};

function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen min-w-screen flex-grow w-full h-full overflow-hidden'>
      <SideMenu />
      <div className='min-h-screen max-h-screen w-full'>
        <InsideWrapperPage>{children}</InsideWrapperPage>
      </div>
    </div>
  );
}

export default MainLayout;
