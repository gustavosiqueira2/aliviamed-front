import { NotebookTabs } from 'lucide-react';
import { Typography } from 'antd';

import FadeWrapper from '@components/FadeWrapper';

const { Text } = Typography;

const AppointmentDetailsEmpty: React.FC = () => (
  <FadeWrapper
    key="no-selection"
    duration={0.1}
    className="flex w-70 flex-1 items-center justify-center"
  >
    <div className="-mt-12 flex flex-col items-center gap-2 text-center">
      <NotebookTabs size={42} className="text-gray-400!" />
      <Text className="max-w-40 text-sm! font-normal! text-gray-400!">
        Selecione um Agendamento para ver mais detalhes
      </Text>
    </div>
  </FadeWrapper>
);

export default AppointmentDetailsEmpty;
