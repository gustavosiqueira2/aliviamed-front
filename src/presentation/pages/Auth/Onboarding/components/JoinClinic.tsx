import { Alert, Button, Card, Divider, Empty, theme, Typography } from 'antd';
import { DoorOpen, Hospital } from 'lucide-react';

import type { TInvite } from '@interfaces/Auth.interface';

import { useAcceptInvite } from '@store/Clinic.store';

import PublicLayout from '@components/Layout/PublicLayout';

const { Title, Text, Paragraph } = Typography;

type TJoinClinicProps = {
  invites: TInvite[];
  onBack: () => void;
};

const JoinClinic = ({ invites, onBack }: TJoinClinicProps) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const { mutate: accept, isPending, variables } = useAcceptInvite();

  return (
    <PublicLayout>
      <div className="flex h-full items-center justify-center overflow-y-auto px-4 py-8">
        <Card
          variant="outlined"
          className="h-fit"
          classNames={{ body: 'flex flex-col p-0!' }}
        >
          <div className="flex items-center gap-4 p-4">
            <div
              className="flex min-h-16 min-w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${colorPrimary}1a` }}
            >
              <DoorOpen size={30} color={colorPrimary} />
            </div>

            <div className="flex flex-col gap-1">
              <Title level={3} className="mb-0!">
                Entrar em uma clínica
              </Title>
              <Paragraph type="secondary" className="mb-0!">
                Para entrar em uma clínica que já existe, peça para um
                administrador da equipe te convidar pelo seu e-mail.
              </Paragraph>
            </div>
          </div>

          <Divider className="my-0!" />

          {invites.length > 0 ? (
            <div className="p-4">
              <Title level={5}>Seus convites</Title>

              <div className="flex flex-col">
                {invites.map((invite) => (
                  <Card
                    key={`invite-${invite.clinicId}`}
                    classNames={{ body: 'p-2!' }}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-8 min-h-8 w-8 min-w-8 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${colorPrimary}1a` }}
                        >
                          <Hospital size={16} color={colorPrimary} />
                        </div>

                        <Text>{invite.clinicName}</Text>
                      </div>

                      <Button
                        type="primary"
                        loading={variables === invite.clinicId}
                        disabled={isPending}
                        onClick={() => accept(invite.clinicId)}
                      >
                        Aceitar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-4">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Nenhum convite ainda"
              />

              <div className="m-4">
                <Alert
                  showIcon
                  title={
                    <Text style={{ color: colorPrimary }}>
                      Caso não tenha recebido o convite, entre em contato com a
                      clinica.
                    </Text>
                  }
                  style={{
                    borderColor: colorPrimary + '40',
                    background: colorPrimary + '10',
                  }}
                />
              </div>
            </div>
          )}

          <Divider className="my-0!" />

          <div className="flex flex-col gap-4 p-4 text-center">
            <Button type="default" block className="h-11" onClick={onBack}>
              Voltar
            </Button>
          </div>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default JoinClinic;
