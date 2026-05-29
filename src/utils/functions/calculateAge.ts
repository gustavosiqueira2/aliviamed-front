import dayjs from 'dayjs';

export const calculateAge = (
  birthdate?: Date | string | null,
): number | null => {
  if (!birthdate) return null;

  const date = dayjs(birthdate);
  if (!date.isValid()) return null;

  return dayjs().diff(date, 'year');
};
