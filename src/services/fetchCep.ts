export type TViaCepAddress = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
};

type TViaCepResponse = Partial<TViaCepAddress> & { erro?: boolean };

export const fetchCep = async (cep: string): Promise<TViaCepAddress | null> => {
  const digits = cep.replace(/\D/g, '');

  if (digits.length !== 8) {
    return null;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as TViaCepResponse;

    if (data.erro) {
      return null;
    }

    return {
      logradouro: data.logradouro ?? '',
      bairro: data.bairro ?? '',
      localidade: data.localidade ?? '',
      uf: data.uf ?? '',
    };
  } catch {
    return null;
  }
};
