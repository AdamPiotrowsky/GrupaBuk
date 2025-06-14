// screens/HomeScreen.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

// Zdefiniuj typy nawigacji (upewnij się, że odzwierciedlają nazwy ekranów w App.tsx)
type RootStackParamList = {
  Menu: undefined;
  Śpiewnik: undefined;
  Mapa: undefined;
  'Plan dnia': undefined;
  'Ważne telefony': undefined;
  'Informator pielgrzymkowy': undefined;
  Zapisy: undefined;
};

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Menu'>;

const menuItems: { title: string; screen: keyof RootStackParamList }[] = [
  { title: 'Śpiewnik', screen: 'Śpiewnik' },
  { title: 'Mapa', screen: 'Mapa' },
  { title: 'Plan dnia', screen: 'Plan dnia' },
  { title: 'Ważne telefony', screen: 'Ważne telefony' },
  { title: 'Informator pielgrzymkowy', screen: 'Informator pielgrzymkowy' },
  { title: 'Zapisy', screen: 'Zapisy' },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  return (
    <View style={styles.container}>
      {menuItems.map((item) => (
        <View style={styles.buttonWrapper} key={item.screen}>
          <Button
            title={item.title}
            onPress={() => navigation.navigate(item.screen)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  buttonWrapper: {
    marginVertical: 8,
  },
});
