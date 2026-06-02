import { Navigate, Route, Routes } from 'react-router';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';
import { PERMISSIONS } from '@constants/PERMISSIONS';

import BaseLayout from '@components/Layout/BaseLayout';

import ProtectedRoute from './ProtectedRoute';

import Home from '@pages/Home/Home';

import PatientDetail from '@pages/Patient/PatientDetail/PatientDetail';
import UpdatePatient from '@pages/Patient/UpdatePatient/UpdatePatient';
import NewPatient from '@pages/Patient/NewPatient/NewPatient';
import Patients from '@pages/Patient/Patients';

import Appointments from '@pages/Appointments/Appointments';

import StartConsult from '@pages/Consult/StartConsult';
import Consult from '@pages/Consult/Consult';

import NewForm from '@pages/Forms/NewForm/NewForm';
import Forms from '@pages/Forms/Forms';

import Workflows from '@pages/Workflows/Workflows';

import Financial from '@pages/Financial/Financial';

import Clinic from '@pages/Clinic/Clinic';

import Page404 from '@pages/404';

const AppRoutes = () => (
  <BaseLayout>
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path={ROUTE_NAMES.PATIENTS}
        element={
          <ProtectedRoute permission={PERMISSIONS.PATIENT_VIEW}>
            <Patients />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${ROUTE_NAMES.PATIENTS}/:patientId`}
        element={
          <ProtectedRoute permission={PERMISSIONS.PATIENT_VIEW}>
            <PatientDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${ROUTE_NAMES.PATIENTS}/update/:patientId`}
        element={
          <ProtectedRoute permission={PERMISSIONS.PATIENT_UPDATE}>
            <UpdatePatient />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_NAMES.NEW_PATIENT}
        element={
          <ProtectedRoute permission={PERMISSIONS.PATIENT_CREATE}>
            <NewPatient />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTE_NAMES.APPOINTMENTS}
        element={
          <ProtectedRoute permission={PERMISSIONS.APPOINTMENT_VIEW}>
            <Appointments />
          </ProtectedRoute>
        }
      />

      <Route
        path={`${ROUTE_NAMES.CONSULT}/start/:appointmentId`}
        element={
          <ProtectedRoute permission={PERMISSIONS.CONSULT_START}>
            <StartConsult />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${ROUTE_NAMES.CONSULT}/:appointmentId`}
        element={
          <ProtectedRoute permission={PERMISSIONS.CONSULT_VIEW}>
            <Consult />
          </ProtectedRoute>
        }
      />

      <Route path={ROUTE_NAMES.FORMS} element={<Forms />} />
      <Route path={ROUTE_NAMES.NEW_FORM} element={<NewForm />} />

      <Route path={ROUTE_NAMES.PATIENT_WORKFLOW} element={<Workflows />} />

      <Route path={ROUTE_NAMES.FINANCIAL} element={<Financial />} />

      <Route path={ROUTE_NAMES.CLINIC} element={<Clinic />} />

      <Route path="*" element={<Page404 />} />

      {/* REDIRECT AFTER LOGIN */}
      <Route path={ROUTE_NAMES.SIGN_IN} element={<Navigate to={'/'} />} />
    </Routes>
  </BaseLayout>
);

export default AppRoutes;
