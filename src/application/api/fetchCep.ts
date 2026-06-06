import api from '../../services/api';

export type TCep = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

export const fetchCep = async (cep: string): Promise<TCep | null> => {
  try {
    const { data } = await api.get(`https://viacep.com.br/ws/${cep}/json/`);

    return data.erro ? null : data;
  } catch (err) {
    console.error('Erro ao buscar CEP:', err);

    return null;
  }
};
