// App.tsx
import 'react-native-gesture-handler'; // MUSI być na samej górze przed innymi importami
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import SpiewnikScreen from './screens/SpiewnikScreen';
import SpiewnikDetailScreen from './screens/SpiewnikDetailScreen';
import DailyPlanScreen from './screens/DailyPlanScreen';
import DailyPlanDetailScreen from './screens/DailyPlanDetailScreen';
import ImportantPhonesScreen from './screens/ImportantPhonesScreen';
import InformatorScreen from './screens/InformatorScreen';
import AutorScreen from './screens/AutorScreen';
import ZapisyScreen from './screens/ZapisyScreen';
import PlaylistScreen from './screens/PlaylistScreen';  
import PlaylistEditScreen from './screens/PlaylistEditScreen';

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
    // 1. Owiń całą aplikację w GestureHandlerRootView, by react-native-gesture-handler działał poprawnie
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          <Stack.Screen name="SpiewnikDetail" component={SpiewnikDetailScreen} options={{ title: '' }} />
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
          <Stack.Screen name="Informator" component={InformatorScreen} options={{ title: 'Co zabrać na pielgrzymkę' }} />
          <Stack.Screen name="Autor" component={AutorScreen} options={{ title: 'Podziękowania' }} />
          <Stack.Screen name="Zapisy" component={ZapisyScreen} />
          <Stack.Screen
            name="PlaylistEdit"
            component={PlaylistEditScreen}
            options={({ route }) => ({ title: `Edytuj: ${route.params.listName}` })}
          />
          <Stack.Screen
            name="Playlist"
            component={PlaylistScreen}
            options={({ route }) => ({ title: route.params.listName })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
