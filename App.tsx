// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import SpiewnikScreen from './screens/SpiewnikScreen';
import MapaScreen from './screens/MapaScreen';
import SpiewnikDetailScreen from './screens/SpiewnikDetailScreen';
// importuj pozostałe ekrany...

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen name="Menu" component={HomeScreen} options={{ title: 'Grupa Buk' }} />
        <Stack.Screen name="Śpiewnik" component={SpiewnikScreen} />
        <Stack.Screen name="Mapa" component={MapaScreen} />
        <Stack.Screen name="Spiewnik" component={SpiewnikScreen} />
<Stack.Screen name="SpiewnikDetail" component={SpiewnikDetailScreen} options={{ title: 'Pieśń' }} />
        {/* dodaj tu kolejne ekrany */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

