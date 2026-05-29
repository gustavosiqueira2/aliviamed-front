import { Layout } from 'antd';

const { Content } = Layout;

type TLoginLayoutProps = {
  children: React.ReactNode;
};

const LoginLayout: React.FC<TLoginLayoutProps> = ({ children }) => {
  return (
    <Layout className="h-full">
      <Content
        className="p-6"
        style={{
          backgroundColor: '#f1f1f1',
          backgroundImage:
            'radial-gradient(#8b5cf640 2px, transparent 2px), radial-gradient(#8b5cf620 2px, #f1f1f1 2px)',
          backgroundSize: '80px 80px',
          backgroundPosition: '0 0,40px 40px',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default LoginLayout;
