import {
  ChevronDownIcon,
  ChevronUpIcon,
  ViewColumnsIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import UIButton from '../Elements/Button';
import { setSideBar } from '@/slice/layoutSlice';
import { sidebarItems } from '@/config/sidebar';
import Logo from "../../assets/ai-exam-logo.jpeg"; // ✅ Import logo

const notExpandedStyle = `sidebar-unexpanded-nav-hover flex mb-[8px] pt-[11px] flex-col text-black items-center justify-center w-[71px] h-15 text-xs px-0 text-[11px] last:mb-0 hover:text-blue-600 hover:bg-blue-100 hover:border-blue-500`;
const expandedStyle = `sidebar-expanded-nav-hover flex mb-[8px] px-[12px] py-[10px] flex-row text-black items-left justify-start w-[220px] h-15 text-xs text-sm last:mb-0 hover:text-blue-600 hover:bg-blue-100 hover:border-blue-500`;

export function Sidebar({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebar, hideSidebar } = useSelector((item) => item.layout);
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRole = localStorage.getItem('role');
  const filteredSidebarItems = sidebarItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const commonStyles = {
    maxWidth: sidebar ? 'calc(100% - 230px)' : 'calc(100% - 87px)',
    maxHeight: 'calc(100vh - 70px)',
  };

  const toggleSidebar = () => {
    dispatch(setSideBar());
  };

  const handleSubMenuToggle = (name) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Universal Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white border-b p-4 flex items-center justify-between">
        {/* Header content for desktop (unchanged) */}
        <div className="hidden md:flex items-center">
          <UIButton
            variant="ghost"
            className="p-1 rounded-md"
            size="xs"
            onClick={toggleSidebar}
          >
            <ViewColumnsIcon height={24} />
          </UIButton>
          <div className="text-lg font-semibold ml-4">
            Exowa Automated Assessment
          </div>
        </div>

        {/* Header content for mobile (with logo) */}
        <div className="md:hidden flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <img
              src={Logo}
              alt="Exowa Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-lg font-semibold">
              Exowa Automated Assessment
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-gray-800 bg-opacity-75">
          <aside className="w-64 bg-white h-full overflow-y-auto pt-16">
            <nav className="flex flex-col p-4">
              {filteredSidebarItems.map((item, index) => (
                <React.Fragment key={`${item.name}-${index}`}>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      if (item.subItems) {
                        handleSubMenuToggle(item.name);
                      } else {
                        navigate(item.url);
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={`flex mb-[8px] px-[12px] py-[10px] flex-row text-black items-left justify-start w-full h-15 text-sm hover:text-blue-600 hover:bg-blue-100 hover:border-blue-500 ${
                      location.pathname === item.url
                        ? 'text-blue-600 bg-blue-100 border-blue-500'
                        : ''
                    }`}
                  >
                    <item.icon className="h-[20px] w-[20px]" />
                    <span className="ml-2">{item.slug}</span>
                    {item.subItems && (
                      <span className="ml-auto">
                        {openSubMenu === item.name ? (
                          <ChevronUpIcon className="h-[16px] w-[16px]" />
                        ) : (
                          <ChevronDownIcon className="h-[16px] w-[16px]" />
                        )}
                      </span>
                    )}
                  </Button>
                  {item.subItems && openSubMenu === item.name && (
                    <div className="flex flex-col pl-[20px]">
                      {item.subItems.map((subItem, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            navigate(subItem.url);
                            setMobileMenuOpen(false);
                          }}
                          className={`flex mb-[8px] px-[12px] py-[10px] flex-row text-black items-left justify-start w-full h-15 text-sm hover:text-blue-600 hover:bg-blue-100 hover:border-blue-500 ${
                            location.pathname === subItem.url
                              ? 'text-blue-600 bg-blue-100 border-blue-500'
                              : ''
                          }`}
                        >
                          <subItem.icon className="h-[20px] w-[20px]" />
                          <span className="ml-2">{subItem.slug}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                  {item?.divider && (
                    <div className="border-[1px] w-full border-gray-300 mb-[8px]"></div>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar and Main Content */}
      <div className="hidden md:flex">
        {!hideSidebar && (
          <aside
            className={`pb-3 top-16 bottom-0 z-10 left-0 rtl:right-0 flex-shrink-0 flex flex-col bg-white text-gray-800 rounded-tr-[6px] rtl:rounded-tl-[6px]
                ${
                  sidebar
                    ? 'p-[12px] pr-1 rtl:pl-1 w-[230px]'
                    : 'p-2 pr-1 rtl:pl-1 w-[98px]'
                }
                text-right rtl:text-left shadow-md`}
          >
            <div className="w-full flex mb-[18px]"></div>
            <nav className="flex flex-col items-center overflow-x-hidden overflow-y-auto max-h-[82vh] h-[100vh]">
              {filteredSidebarItems.map((item, index) => (
                <React.Fragment key={`${item.name}-${index}`}>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      if (item.subItems && sidebar) {
                        handleSubMenuToggle(item.name);
                      } else {
                        if (item?.newPage) {
                          window.open(`/#${item.url}`, '_blank');
                        } else {
                          navigate(item.url);
                        }
                      }
                    }}
                    className={`${!sidebar ? notExpandedStyle : expandedStyle} ${
                      location.pathname === item.url
                        ? 'active text-blue-600 bg-blue-100 border-blue-500'
                        : ''
                    }`}
                  >
                    <item.icon className="h-[20px] w-[20px]" />
                    <span
                      className={`${
                        !sidebar ? 'mt-[8px]' : 'ml-2 rtl:mr-2'
                      } transition-opacity`}
                    >
                      {item.slug}
                    </span>
                    {sidebar && item.subItems && (
                      <span className="ml-auto rtl:mr-auto">
                        {openSubMenu === item.name ? (
                          <ChevronUpIcon className="h-[16px] w-[16px]" />
                        ) : (
                          <ChevronDownIcon className="h-[16px] w-[16px]" />
                        )}
                      </span>
                    )}
                  </Button>
                  {item.subItems && openSubMenu === item.name && sidebar && (
                    <div className="flex flex-col pl-[20px] rtl:pr-[20px]">
                      {item.subItems.map((subItem, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="xs"
                          onClick={() => navigate(subItem.url)}
                          className={`${
                            !sidebar ? notExpandedStyle : expandedStyle
                          } ${
                            location.pathname === subItem.url
                              ? 'active text-blue-600 bg-blue-100 border-blue-500'
                              : ''
                          }`}
                        >
                          <subItem.icon className="h-[25px] w-[25px]" />
                          <span
                            className={`${
                              !sidebar ? 'mt-[8px]' : 'ml-2 rtl:mr-2'
                            } transition-opacity`}
                          >
                            {subItem.slug}
                          </span>
                        </Button>
                      ))}
                    </div>
                  )}
                  {item?.divider && (
                    <div className="border-[1px] w-full border-gray-300 mb-[8px]"></div>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </aside>
        )}
        <div
          className="flex-grow bg-gray-100 overflow-auto mb-20 ml-auto rtl:mr-auto rtl:ml-0"
          style={!hideSidebar ? commonStyles : {}}
        >
          {children}
        </div>
      </div>

      {/* Main content for mobile */}
      <div className="md:hidden mt-16 flex-grow bg-gray-100 overflow-auto">
        {children}
      </div>
    </div>
  );
}
