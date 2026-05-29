import { Button, Card, Table, Typography } from 'antd';

import { usePatients } from '@store/PatientStore';
import { Link } from 'react-router';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';
import FadeWrapper from '@components/FadeWrapper';

const { Title } = Typography;

const Patients = () => {
  const { data: patients } = usePatients();

  return (
    <FadeWrapper>
      <div className="mb-3 flex items-center justify-between">
        <Title level={2} className="mb-0!">
          Pacientes
        </Title>

        <Link to={ROUTE_NAMES.NEW_PATIENT}>
          <Button type="primary">Cadastrar novo</Button>
        </Link>
      </div>

      <Card classNames={{ body: 'p-0!' }}>
        <Table
          dataSource={patients?.data || []}
          rowKey="id"
          columns={[
            { title: 'Nome', dataIndex: 'name' },
            {
              title: 'Data de nascimento',
              dataIndex: 'birthdate',
              render: (v) => new Date(v).toLocaleDateString(),
            },
            {
              render: (v) => (
                <div className="flex justify-end gap-2">
                  <Link to={`update/${v.id}`}>
                    <Button>Editar ficha</Button>
                  </Link>
                  <Link to={v.id}>
                    <Button type="primary">Detalhes</Button>
                  </Link>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </FadeWrapper>
  );
};

export default Patients;
