import Breadcrumb from "../ui/bread-crumb";

function InsideWrapperPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='w-full h-full p-8 bg-gray-200 overflow-y-auto'>
      <Breadcrumb />
      {children}
    </div>
  );
}

export default InsideWrapperPage;
