import { useState } from 'react';

import { Link } from 'react-router';

import { Button, Card, Input, Table, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { usePatients } from '@store/Patient.store';

import { useDebounce } from '@hooks/useDebounce';

import { formatDocument } from '@functions/formatDocument';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';
import { PERMISSIONS } from '@constants/PERMISSIONS';
import FadeWrapper from '@components/FadeWrapper';
import Can from '@components/Can/Can';
import InitialsAvatar from '@components/InitialsAvatar';

const { Title, Text } = Typography;

const Patients = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search, 400);

  const { data: patients, isLoading } = usePatients({
    search: debouncedSearch,
    page,
    limit,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <FadeWrapper className="flex flex-col">
      <Card variant="borderless" classNames={{ body: 'p-0! ' }}>
        <div className="flex items-center justify-between pt-2 pr-3 pb-1 pl-4">
          <Title level={2} className="mb-0!">
            Pacientes
          </Title>

          <Can permission={PERMISSIONS.PATIENT_CREATE}>
            <Link to={ROUTE_NAMES.NEW_PATIENT}>
              <Button type="primary">Cadastrar novo</Button>
            </Link>
          </Can>
        </div>

        <div className="flex gap-2 p-4 pt-0 pb-3">
          <Input
            allowClear
            className="max-w-[320px]"
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Buscar por nome ou documento"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />

          <Button disabled={!search} onClick={() => handleSearch('')}>
            Limpar
          </Button>
        </div>

        <Table
          dataSource={patients?.data}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: patients?.meta.total ?? 0,
            showTotal: (total) => `${total} paciente${total === 1 ? '' : 's'}`,
            onChange: (nextPage, nextLimit) => {
              setPage(nextPage);
              setLimit(nextLimit);
            },
          }}
          columns={[
            {
              align: 'center',
              title: 'Documento',
              render: (p) => <Text>{formatDocument(p.document)}</Text>,
              className: 'w-36',
            },
            {
              title: 'Nome',
              render: (p) => (
                <div className="flex items-center gap-2">
                  <InitialsAvatar name={p.name} size={24} fontSize={10} />
                  <Text>{p.name}</Text>
                </div>
              ),
            },
            {
              align: 'center',
              title: 'Data de nascimento',
              dataIndex: 'birthdate',
              render: (v) => new Date(v).toLocaleDateString(),
            },
            {
              render: (v) => (
                <div className="flex justify-end gap-2">
                  <Can permission={PERMISSIONS.PATIENT_UPDATE}>
                    <Link to={`update/${v.id}`}>
                      <Button>Editar ficha</Button>
                    </Link>
                  </Can>
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
