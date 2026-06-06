// eslint-disable-next-line
export const getApiError = (err: any, fallback?: string) => {
  if (Array.isArray(err) && err.length > 0) {
    return err[0];
  }

  const message = err?.response?.data?.message;

  if (Array.isArray(message) && message.length > 0) {
    return message[0];
  }

  if (typeof message === 'string' && message.length > 0) {
    return message;
  }

  return fallback || 'Estamos passando por instabilidades, tente novamente!';
};
