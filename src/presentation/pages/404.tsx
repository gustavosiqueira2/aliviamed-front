import { Button, Result } from 'antd';

import { Link } from 'react-router';

const Page404 = () => (
  <div className="flex h-full justify-center pt-12">
    <Result
      status="404"
      title="Pagina fora dos nossos limites"
      subTitle="Está pagina não foi encontrada, vamos voltar?"
      extra={
        <Link to={'/'}>
          <Button type="primary">Voltar para o início</Button>
        </Link>
      }
    />
  </div>
);

export default Page404;
