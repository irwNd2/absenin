import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Sekolah - Absenin",
  description: "Lihat Daftar Sekolah di Aplikasi Absenin",
};

function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div>
          <p>Loading.....</p>
        </div>
      }
    >
      <div>{children}</div>
    </Suspense>
  );
}

export default MainLayout;
