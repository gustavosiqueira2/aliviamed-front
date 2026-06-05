import { Link } from 'react-router';

import { Card, Divider, theme, Typography } from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import PublicLayout from '@components/Layout/PublicLayout';

const { Title, Paragraph, Text } = Typography;

const PRIVACY_EMAIL = 'privacidade@aliviamed.com';
const LAST_UPDATE = '05 de junho de 2026';

const Privacy = () => {
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
            Política de Privacidade
          </Title>
          <Text type="secondary">Última atualização: {LAST_UPDATE}</Text>

          <Divider />

          <Paragraph>
            O <span style={{ color: colorPrimary }}>Aliviamed</span> é uma
            plataforma de gestão para clínicas (pacientes, agendamentos e
            prontuários). Esta política explica quais dados tratamos, como os
            usamos e quais são os seus direitos, em conformidade com a Lei Geral
            de Proteção de Dados (LGPD — Lei nº 13.709/2018).
          </Paragraph>

          <Title level={4} className="mb-1!">
            1. Dados que tratamos
          </Title>
          <Paragraph>
            <ul className="ml-5 list-disc">
              <li>
                <strong>Dados de usuários da clínica:</strong> nome, e-mail,
                telefone e função (administrador, recepção ou profissional).
              </li>
              <li>
                <strong>Dados de pacientes:</strong> nome, contato, documentos e
                informações de saúde necessárias ao atendimento, inseridos pela
                clínica.
              </li>
              <li>
                <strong>Dados de uso:</strong> registros de acesso e operação,
                para segurança e funcionamento do serviço.
              </li>
            </ul>
          </Paragraph>

          <Title level={4} className="mb-1!">
            2. Como usamos os dados
          </Title>
          <Paragraph>
            Utilizamos os dados para operar a plataforma: gerenciar
            agendamentos, registrar consultas, enviar notificações
            transacionais (como confirmações e lembretes de consulta) e manter a
            segurança do sistema. Não vendemos os seus dados nem os usamos para
            publicidade.
          </Paragraph>

          <Title level={4} className="mb-1!">
            3. Compartilhamento
          </Title>
          <Paragraph>
            Os dados de pacientes pertencem à clínica responsável pelo
            atendimento e ficam isolados por clínica. Compartilhamos informações
            apenas com fornecedores essenciais à operação (por exemplo, serviços
            de envio de e-mail e hospedagem) e quando exigido por lei.
          </Paragraph>

          <Title level={4} className="mb-1!">
            4. Segurança
          </Title>
          <Paragraph>
            Adotamos medidas técnicas e organizacionais para proteger os dados
            contra acesso não autorizado, perda ou alteração, incluindo controle
            de acesso por clínica e por função. O acesso aos dados de saúde é
            restrito às pessoas autorizadas pela clínica.
          </Paragraph>

          <Title level={4} className="mb-1!">
            5. Seus direitos
          </Title>
          <Paragraph>
            Conforme a LGPD, você pode solicitar acesso, correção, portabilidade
            ou eliminação dos seus dados, além de informações sobre o tratamento.
            Pacientes devem direcionar as solicitações à clínica em que são
            atendidos, que atua como controladora dos seus dados.
          </Paragraph>

          <Title level={4} className="mb-1!">
            6. Retenção
          </Title>
          <Paragraph>
            Mantemos os dados pelo tempo necessário às finalidades descritas e
            ao cumprimento de obrigações legais e regulatórias aplicáveis à área
            da saúde.
          </Paragraph>

          <Divider />

          <Title level={4} className="mb-1!">
            Contato
          </Title>
          <Paragraph className="mb-0!">
            Dúvidas sobre privacidade ou sobre o tratamento dos seus dados podem
            ser enviadas para{' '}
            <a href={`mailto:${PRIVACY_EMAIL}`} style={{ color: colorPrimary }}>
              {PRIVACY_EMAIL}
            </a>
            .
          </Paragraph>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default Privacy;
