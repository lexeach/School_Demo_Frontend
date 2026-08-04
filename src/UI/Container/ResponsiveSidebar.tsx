import { slide as Menu } from 'react-burger-menu';
import React from 'react';
import UIButton from '../Elements/Button';
import { sidebarItems } from '@/config/sidebar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ResponsiveSidebarProps {}

const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = () => {
  const lng = useSelector((state: any) => state.layout.language);
  const navigate = useNavigate();

  return (
    <div className="block sm:hidden">
      <Menu right={lng !== 'en'} pageWrapId={'layout-container'}>
        {sidebarItems.map(item => (
          <div key={item.url}>
            <UIButton
              variant="ghost"
              onClick={() => {
                navigate(item.url);
              }}
              size="xs"
              className="menu-item"
            >
              <item.icon className="h-[20px] w-[20px]" />
              <span className="ml-2 rtl:mr-2 text-sm">{item.slug}</span>
            </UIButton>
          </div>
        ))}
      </Menu>
    </div>
  );
};

export default ResponsiveSidebar;
