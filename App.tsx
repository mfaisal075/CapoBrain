import React from 'react';
import AppNavigator from './src/components/navigator/AppNavigator';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import {UserProvider} from './src/Ctx/UserContext';
import {UserDataProvider} from './src/Ctx/UserDataContext';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  const theme = {
    ...DefaultTheme,
  };
  const queryClient = new QueryClient();
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <UserDataProvider>
            <PaperProvider theme={theme}>
              <AppNavigator />
            </PaperProvider>
          </UserDataProvider>
        </UserProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
};

export default App;
