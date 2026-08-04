import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useDirection } from 'shadcn';
import { useTranslation } from 'react-i18next';

interface Tab {
  name: string;
  component?: React.ReactNode;
}

interface UITabsProps {
  tabs?: Tab[];
  value?: string;
}

const defaultTabs: Tab[] = [{ name: 'Account' }, { name: 'Password' }];

const UITabs: React.FC<UITabsProps> = ({ tabs = defaultTabs, value }) => {
  const [selectedTab, setSelectedTab] = useState(value || '');
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  useEffect(() => {
    setSelectedTab(value);
  }, [value]);

  return (
    <div className="pb-2 border-b border-gray-300 mb-5">
      <Tabs
        value={selectedTab}
        defaultValue={selectedTab}
        className={`w-full ${isRTL ? 'rtl-grid' : ''}`}
      >
        <TabsList className="w-full justify-start mb-4 ml-3">
          {tabs.map(item => (
            <TabsTrigger
              key={item.name}
              variant="underline"
              value={item.name}
              onClick={() => {
                setSelectedTab(item.name);
              }}
            >
              {t(item.name)}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="pb-[1px] pt-0 bg-gray-200 w-full mb-2"></div>
        {tabs.map(item => (
          <TabsContent key={item.name} value={item.name}>
            {item.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default UITabs;
