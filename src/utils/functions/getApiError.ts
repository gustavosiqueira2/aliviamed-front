// eslint-disable-next-line
export const getApiError = (err: any, fallback?: string) => {
  if (Array.isArray(err) && err.length > 0) {
    return err[0];
  }

  if (
    err &&
    err.response &&
    err.response.data &&
    err.response.data.message &&
    Array.isArray(err.response.data.message) &&
    err.response.data.message.length > 0
  ) {
    return err.response.data.message[0];
  }

  return fallback || 'Estamos passando por instabilidades, tente novamente!';
};
