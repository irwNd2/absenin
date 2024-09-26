import Link from "next/link";
import Breadcrumb from "../ui/bread-crumb";

function InsideWrapperPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='w-full h-full pt-8 px-8 bg-gray-200 overflow-auto flex-col flex'>
      <Breadcrumb />
      <div className='w-full h-full flex-grow flex flex-col justify-between'>
        {children}
        <p className='my-1'>
          © 2024, dibuat dengan ❤️ oleh{" "}
          <Link href='' className='font-bold'>
            PUBG Nyantai
          </Link>{" "}
          demi sekolah yang lebih baik.
        </p>
      </div>
    </div>
  );
}

export default InsideWrapperPage;
