import { Link } from 'react-router';

import { Card, Divider, theme, Typography } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import PublicLayout from '@components/Layout/PublicLayout';

const { Title, Paragraph, Text } = Typography;

const SUPPORT_EMAIL = 'suporte@aliviamed.com';

const Help = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  return (
    <PublicLayout>
      <div className="flex h-full justify-center overflow-y-auto px-4 py-8">
        <Card variant="outlined" className="h-fit w-full max-w-3xl">
          <Link to={ROUTE_NAMES['/']} className="text-sm">
            ← Voltar ao início
          </Link>

          <Title level={2} className="mt-3! mb-1!">
            Central de Ajuda
          </Title>
          <Text type="secondary">
            Tudo o que você precisa saber sobre o{' '}
            <span style={{ color: colorPrimary }}>Aliviamed</span>.
          </Text>

          <Divider />

          <Title level={4} className="mb-1!">
            Recebi um e-mail sobre um agendamento
          </Title>
          <Paragraph>
            As notificações de agendamento (confirmação, reagendamento,
            cancelamento e falta) são enviadas pela clínica em que você é
            paciente, através do Aliviamed. Para confirmar, remarcar ou cancelar
            uma consulta, entre em contato diretamente com a sua clínica — ela é
            responsável pela sua agenda.
          </Paragraph>

          <Title level={4} className="mb-1!">
            Não reconheço este e-mail
          </Title>
          <Paragraph>
            Se você recebeu uma mensagem que não esperava, pode ignorá-la com
            segurança. Nenhuma ação é necessária e nenhuma conta é criada sem a
            sua confirmação. Se quiser, escreva para{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: colorPrimary }}>
              {SUPPORT_EMAIL}
            </a>{' '}
            para que possamos verificar.
          </Paragraph>

          <Title level={4} className="mb-1!">
            Esqueci minha senha
          </Title>
          <Paragraph>
            Se você é da equipe de uma clínica (administrador, recepção ou
            profissional), use a opção{' '}
            <Link
              to={ROUTE_NAMES.FORGOT_PASSWORD}
              style={{ color: colorPrimary }}
            >
              Esqueci minha senha
            </Link>{' '}
            na tela de login para receber um link de redefinição.
          </Paragraph>

          <Title level={4} className="mb-1!">
            Recebi um convite para uma clínica
          </Title>
          <Paragraph>
            O convite leva você a uma página para definir sua senha e concluir o
            cadastro. O link é válido por 7 dias. Se ele expirar, peça ao
            administrador da clínica para reenviar o convite.
          </Paragraph>

          <Divider />

          <Title level={4} className="mb-1!">
            Ainda precisa de ajuda?
          </Title>
          <Paragraph className="mb-0!">
            Fale com a nossa equipe de suporte pelo e-mail{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: colorPrimary }}>
              {SUPPORT_EMAIL}
            </a>
            . Respondemos em dias úteis, das 9h às 18h.
          </Paragraph>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default Help;
