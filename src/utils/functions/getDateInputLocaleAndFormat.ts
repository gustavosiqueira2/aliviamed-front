import locale from 'antd/es/date-picker/locale/pt_BR';

const FALLBACK_NAVIGATOR_LANGUAGE = import.meta.env
  .VITE_FALLBACK_NAVIGATOR_LANGUAGE;

export const getDateInputLocaleAndFormat = () => {
  const userLocale =
    navigator.language || FALLBACK_NAVIGATOR_LANGUAGE || 'en-US';

  const isUSLocale =
    new Intl.DateTimeFormat(userLocale).resolvedOptions().locale === 'en-US';
  const format = isUSLocale ? 'MM/DD/YYYY' : 'DD/MM/YYYY';

  return {
    format,
    locale,
  };
};
