import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import axios from 'axios';

interface UserData {
  userName: string | null;
  [key: string]: any; // Adjust according to the structure of your user data
}

interface UserDataContextProps {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  fetchUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextProps | undefined>(
  undefined,
);

export const UserDataProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from the API
  const fetchUserData = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await axios.get('https://demo.capobrain.com/dashboard');
      const data = response.data;

      // Assuming the API returns an object with user details
      setUserData(data);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserDataContext.Provider value={{userData, loading, error, fetchUserData}}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
