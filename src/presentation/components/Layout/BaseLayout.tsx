import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router';

import { FoldHorizontal } from 'lucide-react';
import { Button, Layout, Menu, theme } from 'antd';
import { AnimatePresence } from 'framer-motion';

import { type ROUTE_NAME } from '@constants/ROUTE_NAMES';

import { useWidthBreakpoint } from '@hooks/useWidthBreakpoint';
import { useTheme } from '@contexts/ThemeContext';

import SideBarOption from './SideBarOption';
import BaseHeader from './BaseHeader';

import logo from '@assets/logo.svg';
import UserProfileCard from './UserProfileCard';

const { Sider, Content } = Layout;

type TBaseLayoutProps = {
  children: React.ReactNode;
};

const BaseLayout: React.FC<TBaseLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isGreaterThan = useWidthBreakpoint(1200);

  const { isDark } = useTheme();

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const menuItemTextClass = isDark
    ? '[&_.ant-menu-item:not(.ant-menu-item-selected)]:text-gray-200!'
    : '[&_.ant-menu-item:not(.ant-menu-item-selected)]:text-gray-700!';

  const [collapsed, setCollapsed] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<ROUTE_NAME>(
    (location.pathname as ROUTE_NAME) || '/',
  );

  useEffect(() => {
    setCollapsed(isGreaterThan);
  }, [isGreaterThan]);

  const handleNavigate = (route: ROUTE_NAME) => {
    navigate(route);
    setSelectedRoute(route);
  };

  return (
    <Layout className="flex h-full flex-col">
      <Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
        className="*:flex *:flex-col"
      >
        <div
          style={{
            backgroundColor: colorBgLayout,
          }}
          className="flex w-full items-center justify-between pt-2 pr-1 pb-1 pl-2"
        >
          <Button
            type="text"
            shape="circle"
            onClick={() => handleNavigate('/')}
          >
            <img src={logo} className="w-8" />
          </Button>

          <Button
            type="text"
            shape="circle"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 8,
            }}
          >
            <FoldHorizontal size={16} />
          </Button>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedRoute]}
          className={`flex-1 *:px-2.5! ${menuItemTextClass}`}
          style={{ backgroundColor: colorBgLayout }}
          items={SideBarOption(handleNavigate, selectedRoute)}
        />

        <UserProfileCard />
      </Sider>

      <div className="flex flex-1 flex-col">
        <BaseHeader />

        <Layout>
          <Content className="overflow-auto p-2 pt-0">
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </Content>
        </Layout>
      </div>
    </Layout>
  );
};

export default BaseLayout;
