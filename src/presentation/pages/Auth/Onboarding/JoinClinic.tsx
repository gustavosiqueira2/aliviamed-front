import { Button, Card, theme, Typography } from 'antd';
import { MailQuestion } from 'lucide-react';

import PublicLayout from '@components/Layout/PublicLayout';

const { Title, Text, Paragraph } = Typography;

type TJoinClinicProps = {
  onBack: () => void;
};

const JoinClinic = ({ onBack }: TJoinClinicProps) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  return (
    <PublicLayout>
      <div className="flex h-full items-center justify-center overflow-y-auto px-4 py-8">
        <Card
          variant="outlined"
          className="h-fit w-full max-w-md"
          classNames={{ body: 'flex flex-col items-center gap-4 text-center' }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: `${colorPrimary}1a` }}
          >
            <MailQuestion size={30} color={colorPrimary} />
          </div>

          <div className="flex flex-col gap-1">
            <Title level={3} className="mb-0!">
              Entrar em uma clínica
            </Title>
            <Paragraph type="secondary" className="mb-0!">
              Para entrar em uma clínica que já existe, peça para um
              administrador da equipe te convidar pelo seu e-mail. Você receberá
              um convite para concluir o acesso.
            </Paragraph>
          </div>

          <Text type="secondary" className="text-xs!">
            Já recebeu um convite? Verifique sua caixa de entrada.
          </Text>

          <Button type="default" block className="h-11" onClick={onBack}>
            Voltar
          </Button>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default JoinClinic;
