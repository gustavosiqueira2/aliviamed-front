import { createContext, useContext, useState } from 'react';

interface AuthContext {
  authenticated: boolean;
  token?: string;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContext>({
  authenticated: false,
} as AuthContext);

//eslint-disable-next-line
export const useAuthContext = () => useContext(AuthContext);

type TAuthProviderProps = { children: React.ReactNode };

const AuthProvider: React.FC<TAuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  const login = () => {
    setAuthenticated(true);
  };

  const logout = () => {
    setAuthenticated(false);
  };

  const value: AuthContext = {
    authenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
