import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, ReactNode, useContext, useState} from 'react';

interface UserContextProps {
  userName: string | null;
  setUserName: (userName: string | null) => void;
  userRole: string | null;
  setUserRole: (userRole: string | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void; // Add logout function
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null); // Add token state

  // Logout function
  const logout = async () => {
    setUserName(null);
    setUserRole(null);
    setToken(null); // Clear the token on logout
    await AsyncStorage.clear();
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
        userRole,
        setUserRole,
        token,
        setToken,
        logout,
      }}>
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
