import {createContext, ReactNode, useContext, useState} from 'react';

interface UserContextProps {
  userName: string | null; // Change to userName instead of email
  setUserName: (userName: string | null) => void;
  userRole: string | null;
  setUserRole: (userRole: string | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  return (
    <UserContext.Provider
      value={{userName, setUserName, userRole, setUserRole}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
