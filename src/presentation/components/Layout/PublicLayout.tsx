import { Layout, theme } from 'antd';

const { Content } = Layout;

type TPublicLayoutProps = {
  children: React.ReactNode;
};

const PublicLayout: React.FC<TPublicLayoutProps> = ({ children }) => {
  const {
    token: { colorBgBase },
  } = theme.useToken();

  return (
    <Layout className="h-full">
      <Content
        style={{
          backgroundColor: colorBgBase,
          backgroundImage: `
radial-gradient(#8b5cf640 2px, transparent 2px), radial-gradient(#8b5cf620 4px, ${colorBgBase} 4px)
            `,
          backgroundSize: '80px 80px',
          backgroundPosition: '0 0,40px 40px',
          padding: 0,
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default PublicLayout;
