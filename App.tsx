// App.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import SpiewnikScreen from './screens/SpiewnikScreen';
import DailyPlanScreen from './screens/DailyPlanScreen';
import DailyPlanDetailScreen from './screens/DailyPlanDetailScreen';
import ImportantPhonesScreen from './screens/ImportantPhonesScreen';
import InformatorScreen from './screens/InformatorScreen';
import AutorScreen from './screens/AutorScreen';
import ZapisyScreen from './screens/ZapisyScreen';
import SpiewnikDetailScreen from './screens/SpiewnikDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Status bar – u góry
    StatusBar.setBackgroundColor('#333333');
    StatusBar.setBarStyle('light-content');

    // Navigation bar – pasek na dole Androida
    SystemUI.setBackgroundColorAsync('#333333');
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Menu"
        screenOptions={{
          headerStyle: { backgroundColor: '#333333' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#556B2F' },
        }}
      >
        <Stack.Screen name="Menu" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Śpiewnik" component={SpiewnikScreen} />
        <Stack.Screen name="DailyPlan" component={DailyPlanScreen} options={{ title: 'Plan dnia' }} />
        <Stack.Screen
          name="DailyPlanDetail"
          component={DailyPlanDetailScreen}
          options={({ route }) => ({ title: `Dzień ${route.params.day}` })}
        />
        <Stack.Screen
          name="ImportantPhones"
          component={ImportantPhonesScreen}
          options={{ title: 'Ważne telefony' }}
        />
        <Stack.Screen
          name="SpiewnikDetail"
          component={SpiewnikDetailScreen}
          options={{ title: 'Pieśń' }}
        />

        <Stack.Screen name="Informator" component={InformatorScreen} />
        <Stack.Screen name="Autor" component={AutorScreen} options={{ title: 'Autor' }} />
        <Stack.Screen name="Zapisy" component={ZapisyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}