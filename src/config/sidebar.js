import DashboardSvg from "../assets/Dashboard.svg?react";
import { NotepadText, Baby, FileSymlink, Book, User } from "lucide-react";

export const sidebarItems = [
  {
    name: "Dashboard",
    icon: DashboardSvg,
    slug: "Dashboard",
    url: "/",
    divider: true,
  },
  {
    name: "Papers",
    icon: NotepadText,
    slug: "Papers",
    url: "/papers",
    divider: true,
  },
  {
    name: "User",
    icon: User,
    slug: "user",
    url: "/users",
    divider: true,
     roles: ["admin"], // Only for admin
  },
  {
    name: "Children",
    icon: Baby,
    slug: "Children",
    url: "/children",
    divider: true,
  },
  {
    name: "Syllabus",
    icon: FileSymlink,
    slug: "Syllabus",
    url: "/syllabus",
    divider: true,
    roles: ["admin"], // Only for admin
  },
  {
    name: "Subject",
    icon: Book,
    slug: "Subject",
    url: "/subject",
    divider: true,
    roles: ["admin"], // Only for admin
  },
  {
    name: "Logout",
    icon: Book,
    slug: "Logout",
    url: "/logout",
    divider: true,
  },
];
