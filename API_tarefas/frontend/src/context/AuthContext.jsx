import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Persiste um flag simples em sessionStorage para sobreviver a F5 dentro da sessão
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('auth') === 'true'
  );

  const login = () => {
    sessionStorage.setItem('auth', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('auth');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
