import { usePathname } from "next/navigation";
import { useMemo } from "react";

type Menu = {
  title: string;
  icon: React.ReactNode;
  path: string;
};

const useActiveMenu = (menus: Menu[]) => {
  const currentPath = usePathname();

  const activeMenu = useMemo(() => {
    return menus.filter((menu) => menu.path === currentPath || null);
  }, [currentPath, menus]);

  if (activeMenu.length > 0) return activeMenu[0];
  else return null;
};

export default useActiveMenu;
