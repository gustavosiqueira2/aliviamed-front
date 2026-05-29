const SEX_LABELS: Record<string, string> = {
  MALE: 'Masculino',
  FEMALE: 'Feminino',
  OTHER: 'Outro',
};

export const translateSex = (sex?: string | null): string => {
  if (!sex) return '';

  return SEX_LABELS[sex] ?? sex;
};
