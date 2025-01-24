import {createContext, ReactNode, useContext, useState} from 'react';

interface UserContextProps {
  userName: string | null; // Change to userName instead of email
  setUserName: (userName: string | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [userName, setUserName] = useState<string | null>(null); // Rename email to userName

  return (
    <UserContext.Provider value={{userName, setUserName}}>
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
