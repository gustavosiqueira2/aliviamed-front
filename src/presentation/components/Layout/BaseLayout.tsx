import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router';

import { Banana, FoldHorizontal } from 'lucide-react';
import { Button, Layout, Menu, theme } from 'antd';
import { AnimatePresence } from 'framer-motion';

import { type ROUTE_NAME } from '@constants/ROUTE_NAMES';

import { useWidthBreakpoint } from '@hooks/useWidthBreakpoint';

import SideBarOption from './SideBarOption';

const { Sider, Content } = Layout;

type TBaseLayoutProps = {
  children: React.ReactNode;
};

const BaseLayout: React.FC<TBaseLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isGreaterThan = useWidthBreakpoint(1200);

  const {
    token: { colorBgLayout },
  } = theme.useToken();

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
    <Layout className="h-full">
      <Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
        className="*:flex *:flex-col"
      >
        <div className="flex w-full items-center justify-between pt-2 pr-1 pb-1 pl-2">
          <Button
            type="text"
            shape="circle"
            onClick={() => handleNavigate('/')}
          >
            <Banana />
          </Button>

          <Button
            type="text"
            shape="circle"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 8,
            }}
          >
            <FoldHorizontal size={16} className="text-gray-700" />
          </Button>
        </div>

        <div className="flex h-full flex-col justify-between">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedRoute]}
            className="*:px-2.5! [&_.ant-menu-item:not(.ant-menu-item-selected)]:text-gray-700!"
            style={{ backgroundColor: colorBgLayout }}
            items={SideBarOption(handleNavigate, selectedRoute).start}
          />

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedRoute]}
            className="*:px-2.5! [&_.ant-menu-item:not(.ant-menu-item-selected)]:text-gray-700!"
            style={{ backgroundColor: colorBgLayout }}
            items={SideBarOption(handleNavigate, selectedRoute).end}
          />
        </div>
      </Sider>
      <Layout>
        <Content className="overflow-auto p-2">
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
