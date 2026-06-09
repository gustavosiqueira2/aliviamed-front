import { theme, Typography } from 'antd';

import { useAuth } from '@store/Auth.store';

import InitialsAvatar from '@components/InitialsAvatar';
import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';
import { useNavigate } from 'react-router';

const { Text } = Typography;

const UserProfileCard = () => {
  const navigate = useNavigate();

  const { data: auth } = useAuth();

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  if (!auth) return;

  return (
    <div style={{ backgroundColor: colorBgLayout }} className="p-3 pr-0 pb-2">
      <div
        className="flex cursor-pointer items-center gap-3 rounded-lg"
        onClick={() => navigate(ROUTE_NAMES.SETTINGS)}
      >
        <InitialsAvatar name={auth.user.name} size={28} />

        <div className="flex min-w-0 flex-col">
          <Text className="truncate text-xs! font-semibold!">
            {auth.user.name}
          </Text>
          <Text type="secondary" className="truncate text-xs!">
            {auth.clinicProfile?.clinic.name}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
