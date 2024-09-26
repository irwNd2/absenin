"use client";

export interface TableColumn {
  key: string;
  column: string;
  thClass?: string;
  tdClass?: string;
  render?: (data: any) => JSX.Element;
}

interface TableProps {
  tableHead: TableColumn[];
  tableData: Record<string, any>[];
}

const Table = ({ tableHead, tableData }: Readonly<TableProps>) => {
  const getValue = (key: string, obj: any) => {
    return key.split(".").reduce((o, k) => (o ? o[k] : ""), obj);
  };

  return (
    <div className='relative my-3 h-auto'>
      <table className='w-full text-base'>
        <thead className='text-xs text-darkgray text-left  h-11'>
          <tr className='relative w-full'>
            {tableHead.map((head) => (
              <th
                key={head.key}
                className={`py-3 px-4 uppercase text-[#61777F]/80 text-xs font-bold ${
                  head.thClass || ""
                }`}
                scope='col'
              >
                {head.column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='relative h-auto py-3'>
          {tableData.length > 0 ? (
            tableData.map((data, index) => (
              <tr key={index} className='border-t text-[12px]'>
                {tableHead.map((head) => (
                  <td
                    key={head.key}
                    className={`p-3 whitespace-nowrap ${head.tdClass || ""}`}
                  >
                    {head.render ? head.render(data) : getValue(head.key, data)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                className='text-center p-5 font-semibold'
                colSpan={tableHead.length}
              >
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
