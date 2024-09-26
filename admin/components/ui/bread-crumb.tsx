"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const formatBreadcrumb = (str: string) => {
  if (str === "orang-tua") return "Orang Tua Siswa";
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function Breadcrumb() {
  const path = usePathname();
  const pathArray = path.split("/").filter((x) => x);

  const breadcrumbs = useMemo(() => {
    return pathArray.map((path, idx) => {
      const href = "/" + pathArray.slice(0, idx + 1).join("/");
      return { name: formatBreadcrumb(path), href };
    });
  }, [pathArray]);

  if (path === "/") return null;

  return (
    <nav>
      <ol className='flex space-x-1'>
        <li>
          <Link href='/'>Dashboard</Link>
        </li>
        {breadcrumbs.map((crumb, idx) => (
          <li key={crumb.href} className='flex items-center'>
            <span className='mx-3'>
              <ChevronRight className='h-4' />
            </span>
            {idx === breadcrumbs.length - 1 ? (
              <span className='text-gray-500'>{crumb.name}</span>
            ) : (
              <Link href={crumb.href} className='text-blue-600'>
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
