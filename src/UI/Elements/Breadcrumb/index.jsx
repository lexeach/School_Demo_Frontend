import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RouteTabs from '../Tabs/RouteTabs';
import { Slash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function UIBreadcumb({
  breadcrumbs = [],
  trigger = false,
  tabsData = [],
}) {
  const location = useLocation();
  const [breadcrumb, setBreadcrumb] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { sidebar } = useSelector(item => item.layout);
  useEffect(() => {
    if (breadcrumbs.length > 0) {
      setBreadcrumb(breadcrumbs);
    } else {
      const pathnames = location.pathname.split('/').filter(x => x);
      const breadcrumbItems = [
        { name: t('home'), path: '/', color: true },
        ...pathnames.map((name, index) => {
          const path = `/${pathnames.slice(0, index + 1).join('/')}`;
          return { name, path };
        }),
      ];
      setBreadcrumb(breadcrumbItems);
    }
  }, [location.pathname, t]);

  return (
    <div className="flex flex-col bg-muted/40 pl-4 py-3 ">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 mr-4">
        {sidebar || tabsData.length === 0 ? (
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {breadcrumb.map((item, index) => (
                <Fragment key={item.name}>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      asChild
                      className={`cursor-pointer ${
                        item.color ? 'text-blue-600' : ''
                      }`}
                    >
                      <div onClick={() => navigate(item.path)}>
                        {t(item.name)}
                      </div>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumb.length - 1 !== index && (
                    <BreadcrumbSeparator>
                      <Slash />
                    </BreadcrumbSeparator>
                  )}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        ) : (
          <RouteTabs tabs={tabsData} />
        )}
      </div>
    </div>
  );
}
