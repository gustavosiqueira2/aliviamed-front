import {
  CalendarDays,
  FilePen,
  Hospital,
  House,
  Settings,
  UserRound,
  Wallet,
  Workflow,
} from 'lucide-react';

import { ROUTE_NAMES, type ROUTE_NAME } from '@constants/ROUTE_NAMES';
import { PERMISSIONS, type TPermission } from '@constants/PERMISSIONS';

import { useAuth } from '@store/AuthStore';

import { usePermissions } from '@hooks/usePermissions';

const SideBarOption = (
  handleNavigate: (route: ROUTE_NAME) => void,
  selectedRoute: ROUTE_NAME,
) => {
  const { data } = useAuth();
  const { hasPermission } = usePermissions();

  const getIconColor = (defaultColor: string, route: ROUTE_NAME) => {
    if (route === selectedRoute) {
      return { color: 'white' };
    }

    return { color: defaultColor };
  };

  const start: { permission?: TPermission; item: Record<string, unknown> }[] = [
    {
      item: {
        key: '/',
        label: 'Home',
        icon: <House size={18} {...getIconColor('#7c3aed', '/')} />,
        onClick: () => handleNavigate('/'),
      },
    },
    {
      permission: PERMISSIONS.PATIENT_VIEW,
      item: {
        key: ROUTE_NAMES.PATIENTS,
        label: 'Pacientes',
        icon: (
          <UserRound
            size={18}
            {...getIconColor('#2563eb', ROUTE_NAMES.PATIENTS)}
          />
        ),
        onClick: () => handleNavigate(ROUTE_NAMES.PATIENTS),
      },
    },
    {
      permission: PERMISSIONS.APPOINTMENT_VIEW,
      item: {
        key: ROUTE_NAMES.APPOINTMENTS,
        label: 'Agenda',
        icon: (
          <CalendarDays
            size={18}
            {...getIconColor('#ea580c', ROUTE_NAMES.APPOINTMENTS)}
          />
        ),
        onClick: () => handleNavigate(ROUTE_NAMES.APPOINTMENTS),
      },
    },
    {
      item: {
        key: ROUTE_NAMES.FORMS,
        label: 'Formulários',
        icon: (
          <FilePen size={18} {...getIconColor('#059669', ROUTE_NAMES.FORMS)} />
        ),
        onClick: () => handleNavigate(ROUTE_NAMES.FORMS),
      },
    },
    {
      item: {
        key: ROUTE_NAMES.PATIENT_WORKFLOW,
        label: 'Eventos',
        icon: (
          <Workflow
            size={18}
            {...getIconColor('#c026d3', ROUTE_NAMES.PATIENT_WORKFLOW)}
          />
        ),
        onClick: () => handleNavigate(ROUTE_NAMES.PATIENT_WORKFLOW),
      },
    },
    {
      item: {
        key: ROUTE_NAMES.FINANCIAL,
        label: 'Financeiro',
        icon: (
          <Wallet
            size={18}
            {...getIconColor('#0d9488', ROUTE_NAMES.FINANCIAL)}
          />
        ),
        onClick: () => handleNavigate(ROUTE_NAMES.FINANCIAL),
      },
    },
    {
      item: {
        key: ROUTE_NAMES.CLINIC,
        label: 'Clinica',
        icon: (
          <Hospital size={18} {...getIconColor('#e11d48', ROUTE_NAMES.CLINIC)} />
        ),
        onClick: () => handleNavigate(ROUTE_NAMES.CLINIC),
      },
    },
  ];

  return {
    start: start
      .filter((entry) => !entry.permission || hasPermission(entry.permission))
      .map((entry) => entry.item),
    end: [
      {
        key: 'selected-clinic',
        label: data?.clinicProfile.clinic.name,
        icon: <Hospital size={18} color="#52525b" />,
      },
      {
        key: ROUTE_NAMES.SETTINGS,
        label: 'Configurações',
        icon: <Settings size={18} color="#52525b" />,
        onClick: () => handleNavigate(ROUTE_NAMES.SETTINGS),
      },
    ],
  };
};

export default SideBarOption;
