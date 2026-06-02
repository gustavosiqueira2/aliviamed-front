export type ROUTE_NAME = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES];

export const ROUTE_NAMES = {
  '/': '/',

  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',

  COMPLETE_REGISTRATION: '/complete-registration',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  PATIENTS: '/patients',
  NEW_PATIENT: '/new-patient',

  APPOINTMENTS: '/appointments',

  CONSULT: '/consult',

  FORMS: '/forms',
  NEW_FORM: '/new-form',

  PATIENT_WORKFLOW: '/patient-workflow',

  FINANCIAL: '/financial',

  CLINIC: '/clinic',

  SETTINGS: '/settings',
} as const;
