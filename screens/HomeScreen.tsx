// screens/HomeScreen.tsx
import React from 'react';
import { View, Button, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Menu: undefined;
  Śpiewnik: undefined;
  DailyPlan: undefined;
  ImportantPhones: undefined;
  Informator: undefined;
  Autor: undefined;         // ← też tu
  // Zapisy jest linkiem, nie screenem
};

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Menu'>;

const ZAPISY_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeYdHi8-eIwPcN5IuHnF34laMaoQSj7OOt7jLiNGNaMBuTyZw/viewform';
const STRONA_URL = 'http://grupa21.archpoznan.pl/';

const menuItems = [
  { title: 'Śpiewnik',       action: 'navigate', screen: 'Śpiewnik' as const },
  { title: 'Plan dnia',      action: 'navigate', screen: 'DailyPlan' as const },
  { title: 'Ważne telefony', action: 'navigate', screen: 'ImportantPhones' as const },
  { title: 'Informator',     action: 'navigate', screen: 'Informator' as const },
  { title: 'Autor',          action: 'navigate', screen: 'Autor' as const },
  { title: 'Grupowa strona', action: 'link',     url: STRONA_URL },
  { title: 'Zapisy',         action: 'link',     url: ZAPISY_URL },
] as const;

type MenuItem = typeof menuItems[number];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  const handlePress = (item: MenuItem) => {
    if (item.action === 'link' && item.url) {
      Linking.openURL(item.url).catch(console.error);
    } else if (item.action === 'navigate' && item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <View style={styles.container}>
      {menuItems.map(item => (
        <View style={styles.buttonWrapper} key={item.title}>
          <Button title={item.title} onPress={() => handlePress(item)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, padding: 16, justifyContent: 'center' },
  buttonWrapper:{ marginVertical: 8 },
});
