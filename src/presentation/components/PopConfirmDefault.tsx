import { Popconfirm } from 'antd';

type TPopConfirmDefaultProps = {
  title: string;
  description: string;
  disabled?: boolean;
  onConfirm: () => void;
  children: React.ReactNode;
};

const PopConfirmDefault: React.FC<TPopConfirmDefaultProps> = (props) => {
  const { title, description, disabled, onConfirm, children } = props;

  return (
    <Popconfirm
      title={title}
      description={description}
      okText="Sim"
      cancelText="Não"
      disabled={disabled}
      onConfirm={onConfirm}
    >
      {children}
    </Popconfirm>
  );
};

export default PopConfirmDefault;
