/**
 * Main App Component
 * E-commerce Application
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './src/context';
import { RootNavigator } from './src/navigation';
import { COLORS } from './src/constants/theme';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CartProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={COLORS.white}
          />
          <RootNavigator />
        </CartProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
