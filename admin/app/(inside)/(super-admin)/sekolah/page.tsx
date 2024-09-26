"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Table, { TableColumn } from "@/components/custom-table";
import ActionChangeSchool from "@/components/sekolah/action-change";

function SekolahPage() {
  const tableHead: TableColumn[] = [
    { key: "name", column: "Nama Sekolah" },
    { key: "npsn", column: "npsn" },
    { key: "address", column: "alamat" },
    {
      key: "created_date",
      column: "Dibuat Tanggal",
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
      name: "SMAN 2 Sinjai",
      npsn: "78235653788383",
      address: "Jln. Sinjai Makmur Sejahtera No 32",
      created_date: "12 September 2024",
    },
    {
      name: "SMAN 4 Sinjai",
      npsn: "89835725934999",
      address: "Jln. Sinjai Tidak Makmur Sejahtera No 12",
      created_date: "12 September 2024",
    },
    {
      name: "SMAN 2 Sinjai",
      npsn: "78235653788383",
      address: "Jln. Sinjai Makmur Sejahtera No 32",
      created_date: "12 September 2024",
    },
    {
      name: "SMAN 4 Sinjai",
      npsn: "89835725934999",
      address: "Jln. Sinjai Tidak Makmur Sejahtera No 12",
      created_date: "12 September 2024",
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
        <p className='pt-4 px-4 text-lg font-semibold'>Daftar Sekolah</p>
        <Table tableHead={tableHead} tableData={tableData} />
      </div>
    </div>
  );
}

export default SekolahPage;
