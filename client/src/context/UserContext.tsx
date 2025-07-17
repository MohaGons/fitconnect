import { createContext, useContext, useState } from 'react';
import { useKeycloakContext } from '../services/useKeycloakContext'; 

type UserContextType = {
  user: any; 
  role: string | null;
  setUser: (user: any) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { keycloak } = useKeycloakContext();
  const [user, setUser] = useState<any>(null);

  const role = (() => {
    const roles = keycloak?.tokenParsed?.realm_access?.roles || [];
    if (roles.includes('COACH')) return 'COACH';
    if (roles.includes('CLIENT')) return 'CLIENT';
    if (roles.includes('ADMIN')) return 'ADMIN';
    return null;
  })();

  return (
    <UserContext.Provider value={{ user, setUser, role }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
