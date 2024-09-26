"use client";
import { Button } from "../ui/button";

function ActionChangeSchool({ data }: Readonly<{ data: any }>) {
  return (
    <Button
      onClick={() => console.log(data)}
      variant={"ghost"}
      size={"lg"}
      className='text-[#61777F] text-xs font-bold p-2 w-full h-8 -mt-1 rounded-[8px] hover:bg-white'
    >
      Ubah
    </Button>
  );
}

export default ActionChangeSchool;
