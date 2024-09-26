"use client";
import Table, { TableColumn } from "@/components/custom-table";
import ActionChangeSchool from "@/components/sekolah/action-change";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function OperatorSekolahPage() {
  const tableHead: TableColumn[] = [
    { key: "name", column: "Nama Operator" },
    { key: "nisn", column: "nisn" },
    { key: "school", column: "Nama sekolah" },
    { key: "email", column: "Alamat Email" },
    {
      key: "created_date",
      column: "Didaftarkan Tanggal",
    },
    {
      key: "action",
      column: "",
      render: (data: any) => {
        return <ActionChangeSchool data={data} />;
      },
    },
  ];

  const tableData = [
    {
      name: "Ulla Bot",
      nisn: "78235653788383",
      email: "op1@sinjai.sch.id",
      created_date: "12 September 2024",
      school: "SMA 2 Sinjai",
    },
    {
      name: "Irwan Pro hehe",
      nisn: "89835725934999",
      email: "op1@sinjai.sch.id",
      created_date: "12 September 2024",
      school: "SMA 2 Sinjai",
    },
    {
      name: "Ulla Bot 2",
      nisn: "78235653788383",
      email: "Jln. Sinjai Makmur Sejahtera No 32",
      created_date: "12 September 2024",
      school: "SMA 2 Sinjai",
    },
    {
      name: "Irwan Pro Max",
      nisn: "89835725934999",
      email: "op1@sinjai.sch.id",
      created_date: "12 September 2024",
      school: "SMA 2 Sinjai",
    },
  ];
  return (
    <div className='w-full flex flex-col gap-2'>
      <div className='w-full flex justify-end'>
        <Button
          type='submit'
          variant={"outline"}
          size={"lg"}
          className=' bg-[#61777F] flex gap-1 text-white text-sm font-bold mt-1 py-2 px-3 h-12 rounded-[12px] hover:bg-[#61777F] hover:text-white '
        >
          <span>
            <Plus className='h-[18px]' />
          </span>
          Tambah
        </Button>
      </div>
      <div className='rounded-lg bg-white shadow w-full flex flex-col gap-2'>
        <p className='pt-4 px-4 text-lg font-semibold'>
          Daftar Operator Sekolah
        </p>
        <Table tableHead={tableHead} tableData={tableData} />
      </div>
    </div>
  );
}

export default OperatorSekolahPage;
