import React from 'react';
import AppNavigator from './src/components/navigator/AppNavigator';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import {UserProvider} from './src/Ctx/UserContext';
import {UserDataProvider} from './src/Ctx/UserDataContext';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const App = () => {
  const theme = {
    ...DefaultTheme,
  };
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <UserDataProvider>
          <PaperProvider theme={theme}>
            <AppNavigator />
          </PaperProvider>
        </UserDataProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
