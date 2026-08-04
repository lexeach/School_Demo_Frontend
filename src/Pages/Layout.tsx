import { Outlet, useLocation } from "react-router-dom";
import { showSidebar } from "@/slice/layoutSlice";
import { useDispatch, useSelector } from "react-redux";

import { DeleteDialog } from "@/UI/Elements/Dialog/delete";
import { Sidebar } from "../UI/Container/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopBar } from "../UI/Container/TopBar";
import UISheet from "@/UI/Sheet";
import { useEffect } from "react";

const Layout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { hideSidebar } = useSelector((item) => item.layout);

  useEffect(() => {
    if (hideSidebar) {
      dispatch(showSidebar());
    }
  }, [location.pathname]);

  return (
    <div className="bg-gray-100">
      <DeleteDialog />
      <TooltipProvider>
        <UISheet />
        <TopBar />
        <Sidebar>
          <Outlet />
        </Sidebar>
      </TooltipProvider>
    </div>
  );
};

export default Layout;
