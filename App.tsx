import React from 'react';
import AppNavigator from './src/components/navigator/AppNavigator';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import {UserProvider} from './src/Ctx/UserContext';
import {UserDataProvider} from './src/Ctx/UserDataContext';

const App = () => {
  const theme = {
    ...DefaultTheme,
  };
  return (
    <UserProvider>
      <UserDataProvider>
        <PaperProvider theme={theme}>
          <AppNavigator />
        </PaperProvider>
      </UserDataProvider>
    </UserProvider>
  );
};

export default App;
