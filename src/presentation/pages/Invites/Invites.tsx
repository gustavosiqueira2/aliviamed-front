import { Typography } from 'antd';

import FadeWrapper from '@components/FadeWrapper';
import InviteList from '@components/Invites/InviteList';

const { Title } = Typography;

const Invites = () => (
  <FadeWrapper className="flex flex-col">
    <Title level={2} className="mb-2!">
      Convites
    </Title>

    <div className="w-full max-w-xl">
      <InviteList />
    </div>
  </FadeWrapper>
);

export default Invites;
