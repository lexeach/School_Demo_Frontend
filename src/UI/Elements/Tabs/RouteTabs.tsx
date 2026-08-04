import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

type Tab = {
  name: string;
  path: string;
};

const RouteTabs: React.FC = ({ tabs }) => {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <div className="w-full   p-4">
      <div className="flex space-x-4 border-b justify-start">
        {tabs.map((tab, index) => (
          <Link
            key={index}
            to={tab.path}
            className={`py-2 px-4 transition-colors duration-300 ${
              location.pathname === tab.path
                ? 'border-b-2 border-blue-500 text-blue-500 font-semibold'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {t(tab.name)}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RouteTabs;
