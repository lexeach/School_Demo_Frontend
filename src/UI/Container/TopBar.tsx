import {
  ArrowRightEndOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import Logo from "../../assets/ai-exam-logo.jpeg";
import UIAvatar from "../Elements/Avatar";
import UIDropdown from "../Elements/Dropdown";
import { handleLogout } from "@/slice/authSlice";
import { useDispatch } from "react-redux";

export function TopBar() {
  const dispatch = useDispatch();

  const options = [
    {
      label: "Profile",
      value: "profile",
      icon: <UserCircleIcon color="black" width={20} />,
    },
    {
      label: "Logout",
      value: "logout",
      icon: <ArrowRightEndOnRectangleIcon color="stroke-red-500" width={20} />,
      className: "text-red-500 hover:text-red-600",
    },
  ];

  const handleOption = async (val) => {
    if (val === "logout") {
      try {
        dispatch(handleLogout());
      } catch (error) {
        console.error("Failed to logout: ", error);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <header className="hidden md:flex top-0 left-0 right-0 z-30 h-16 items-center gap-4 bg-background px-4 md:px-6 shadow-md">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <div className="w-[230px]">
            <img className="h-[24px]" src={Logo} alt="Logo" />
          </div>
        </nav>
        <div className="flex w-full items-center gap-2 md:ml-auto md:gap-2 lg:gap-2">
          <form className="ml-auto flex-1">
            <div className="flex hidden sm:block"></div>
          </form>
          <UIDropdown
            className="p-0 md:block hidden"
            options={options}
            customName={<UIAvatar />}
            onChange={handleOption}
          />
        </div>
      </header>
    </div>
  );
}
