import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Absenin - Lupa Passowrd",
  description: "Silahkan menggunakan form berikut untuk mereset passowrd",
};

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className='w-full h-full'>{children}</div>;
}

export default Layout;
