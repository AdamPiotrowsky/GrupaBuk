// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen            from './screens/HomeScreen';
import SpiewnikScreen        from './screens/SpiewnikScreen';
import DailyPlanScreen       from './screens/DailyPlanScreen';
import DailyPlanDetailScreen from './screens/DailyPlanDetailScreen';
import ImportantPhonesScreen from './screens/ImportantPhonesScreen';
import InformatorScreen      from './screens/InformatorScreen';
import AutorScreen           from './screens/AutorScreen';          // ← upewnij się, że tu jest
import ZapisyScreen          from './screens/ZapisyScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen
          name="Menu"
          component={HomeScreen}
          options={{ title: 'Grupa Buk' }}
        />
        <Stack.Screen
          name="Śpiewnik"
          component={SpiewnikScreen}
        />
        <Stack.Screen
          name="DailyPlan"
          component={DailyPlanScreen}
          options={{ title: 'Plan dnia' }}
        />
        <Stack.Screen
          name="DailyPlanDetail"
          component={DailyPlanDetailScreen}
          options={({ route }) => ({ title: `Day ${route.params.day}` })}
        />
        <Stack.Screen
          name="ImportantPhones"
          component={ImportantPhonesScreen}
          options={{ title: 'Ważne telefony' }}
        />
        <Stack.Screen
          name="Informator"
          component={InformatorScreen}
        />
        <Stack.Screen
          name="Autor"                               // ← dokładnie ta nazwa
          component={AutorScreen}
          options={{ title: 'Autor' }}
        />
        <Stack.Screen
          name="Zapisy"
          component={ZapisyScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
