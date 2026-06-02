import { Navigate, Route, Routes } from 'react-router';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';

import LoginLayout from '@components/Layout/LoginLayout';

import SingIn from '@pages/Auth/SingIn/SingIn';
import SignUp from '@pages/Auth/SingUp/SignUp';
import ForgotPassword from '@pages/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from '@pages/Auth/ResetPassword/ResetPassword';

const LoginRoutes = () => (
  <LoginLayout>
    <Routes>
      <Route path={ROUTE_NAMES.SIGN_IN} element={<SingIn />} />
      <Route path={ROUTE_NAMES.SIGN_UP} element={<SignUp />} />

      <Route
        path={ROUTE_NAMES.FORGOT_PASSWORD}
        element={<ForgotPassword />}
      />
      <Route path={ROUTE_NAMES.RESET_PASSWORD} element={<ResetPassword />} />

      <Route path="*" element={<Navigate to={ROUTE_NAMES.SIGN_IN} />} />
    </Routes>
  </LoginLayout>
);

export default LoginRoutes;
