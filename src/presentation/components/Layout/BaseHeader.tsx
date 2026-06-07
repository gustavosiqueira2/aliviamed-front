import { useState } from 'react';

import { useNavigate } from 'react-router';

import { ArrowUpDown, Bell, Settings } from 'lucide-react';
import type { ItemType } from 'antd/es/menu/interface';
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Empty,
  Modal,
  Space,
  theme,
  Typography,
} from 'antd';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import { switchClinic, useAuth } from '@store/Auth.store';

const { Text } = Typography;

const BaseHeader = () => {
  const navigate = useNavigate();

  const {
    token: { colorTextBase },
  } = theme.useToken();

  const { data } = useAuth();

  const invites = data?.invites ?? [];

  const [changeClinicDropdownOpen, setChangeClinicDropdownOpen] =
    useState(false);

  const [clinicToSwitch, setClinicToSwitch] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const currentClinicId = data?.clinicProfile?.clinic.id;

  const switchableClinics =
    data?.userClinics.filter(
      (userClinic) =>
        userClinic.status === 'ACTIVE' &&
        userClinic.clinic.id !== currentClinicId,
    ) ?? [];

  const clinicsInDropdown: ItemType[] = [
    {
      key: 'current',
      label: data?.clinicProfile?.clinic.name,
      disabled: true,
    },
    {
      type: 'divider',
    },
  ];

  if (switchableClinics.length > 0) {
    clinicsInDropdown.push({
      key: 'switch-group',
      label: 'Trocar de clinica',
      type: 'group',
    });
    switchableClinics.forEach(({ clinic: { id, name } }) => {
      clinicsInDropdown.push({
        key: id,
        label: name,
        onClick: () => {
          setChangeClinicDropdownOpen(false);
          setClinicToSwitch({ id, name });
        },
      });
    });
    clinicsInDropdown.push({
      type: 'divider',
    });
  }

  clinicsInDropdown.push({
    key: 'new-clinic',
    label: 'Criar nova clinica',
  });

  const handleConfirmSwitch = () => {
    if (!clinicToSwitch) return;

    switchClinic(clinicToSwitch.id);
    setClinicToSwitch(null);
    navigate(ROUTE_NAMES['/']);
  };

  return (
    <div className="flex w-full items-center justify-end p-2 pt-1">
      <div className="flex items-center gap-1">
        <Dropdown
          trigger={['click']}
          popupRender={() => (
            <Card size="small" title="Notificações" className="shadow-lg">
              {invites.length > 0 ? (
                <div>
                  {invites.map((invite) => (
                    <div
                      key={`invite-${invite.clinicId}`}
                      className="flex items-center gap-8"
                    >
                      <Text>Convite para entrar em: {invite.clinicName}</Text>

                      <Button
                        size="small"
                        type="primary"
                        onClick={() => navigate(ROUTE_NAMES.INVITES)}
                      >
                        Ver convites
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Nenhuma notificação"
                />
              )}
            </Card>
          )}
        >
          <Button type="text" shape="circle">
            <Badge dot={invites.length > 0} size="small">
              <Bell size={18} />
            </Badge>
          </Button>
        </Dropdown>

        <Button
          type="text"
          shape="circle"
          onClick={() => navigate(ROUTE_NAMES.SETTINGS)}
        >
          <Settings size={18} />
        </Button>

        <Space.Compact>
          <Button
            className="shadow-none!"
            onClick={() => navigate(ROUTE_NAMES.CLINIC)}
          >
            {data?.clinicProfile?.clinic.name}
          </Button>

          <Dropdown
            open={changeClinicDropdownOpen}
            menu={{
              onMouseLeave: (): void => setChangeClinicDropdownOpen(false),
              items: clinicsInDropdown,
            }}
          >
            <Button
              className="shadow-none!"
              icon={<ArrowUpDown size={15} style={{ color: colorTextBase }} />}
              onClick={() => setChangeClinicDropdownOpen(true)}
            />
          </Dropdown>
        </Space.Compact>
      </div>

      <Modal
        title="Trocar de clínica"
        open={clinicToSwitch !== null}
        okText="Trocar"
        cancelText="Cancelar"
        onCancel={() => setClinicToSwitch(null)}
        onOk={handleConfirmSwitch}
      >
        Deseja trocar para a clínica <strong>{clinicToSwitch?.name}</strong>? Os
        dados exibidos serão atualizados para a nova clínica.
      </Modal>
    </div>
  );
};

export default BaseHeader;
