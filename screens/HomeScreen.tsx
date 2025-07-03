// screens/HomeScreen.tsx

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Linking,
  StatusBar,
  Dimensions,
  useWindowDimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Tile from '../components/Tile';



const { height: windowH } = Dimensions.get('window');

// Typy nawigacji
type RootStackParamList = {
  Menu: undefined;
  Śpiewnik: undefined;
  DailyPlan: undefined;
  Informator: undefined;
  Autor: undefined;
  Zapisy: undefined;
};
type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Menu'>;

const ZAPISY_URL =
  'https://forms.gle/ETuaSA6yd2mJUKVFA';

const menuItems = [
    {
    key: 'plan',
    title: 'INFORMACJE NA KAŻDY DZIEŃ',
    action: 'navigate' as const,
    screen: 'DailyPlan',
    icon: require('../assets/icons/plan.png'),
  },

    {
    key: 'informator',
    title: 'CO ZABRAĆ NA PIELGRZYMKĘ',
    action: 'navigate' as const,
    screen: 'Informator',
    icon: require('../assets/icons/checklist.png'),
  },

  {
    key: 'spiewnik',
    title: 'ŚPIEWNIK',
    action: 'navigate' as const,
    screen: 'Śpiewnik',
    icon: require('../assets/icons/spiewnik.png'),
  },

  {
    key: 'zapisy',
    title: 'INTENCJE',
    action: 'link' as const,
    url: ZAPISY_URL,
    icon: require('../assets/icons/form.png'),
    accessoryIcon: require('../assets/icons/out.png'),
  },
] as const;
type MenuItem = typeof menuItems[number];

export default function HomeScreen() {
  // Stałe hooki
  const navigation = useNavigation<HomeNavProp>();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isPortrait = height >= windowH;

  // Stan fontów
  const [fontsLoaded] = useFonts({
    'LeagueSpartan-Bold': require('../assets/fonts/LeagueSpartan-Bold.ttf'),
  });

  // Stan nagłówkowego obrazka
  const [headerImg, setHeaderImg] = useState<any>(null);

  // Ustawienia status bar oraz losowanie nagłówka przy focusie ekranu
  useFocusEffect(
    useCallback(() => {
      // StatusBar
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');

      // Losowanie nagłówka:
      // Upewnij się, że masz dokładne pliki w assets, np. zdjecie1.png itd.
      const imgs = [
        require('../assets/HomePagePhotos/zdjecie1.png'),
        require('../assets/HomePagePhotos/zdjecie2.png'),
        require('../assets/HomePagePhotos/zdjecie3.png'),
        require('../assets/HomePagePhotos/zdjecie4.png'),
        require('../assets/HomePagePhotos/zdjecie5.png'),
        require('../assets/HomePagePhotos/zdjecie6.png'),
        require('../assets/HomePagePhotos/zdjecie7.png'),
        require('../assets/HomePagePhotos/zdjecie8.png'),
        require('../assets/HomePagePhotos/zdjecie9.png'),
        require('../assets/HomePagePhotos/zdjecie10.png'),
        require('../assets/HomePagePhotos/zdjecie11.png'),
        require('../assets/HomePagePhotos/zdjecie12.png'),
        require('../assets/HomePagePhotos/zdjecie13.png'),
        require('../assets/HomePagePhotos/zdjecie14.png'),
        require('../assets/HomePagePhotos/zdjecie15.png'),
        require('../assets/HomePagePhotos/zdjecie16.png'),
        require('../assets/HomePagePhotos/zdjecie17.png'),
        require('../assets/HomePagePhotos/zdjecie18.png'),
        require('../assets/HomePagePhotos/zdjecie19.png'),
        require('../assets/HomePagePhotos/zdjecie20.png'),
        require('../assets/HomePagePhotos/zdjecie21.png'),
        require('../assets/HomePagePhotos/zdjecie22.png'),
        require('../assets/HomePagePhotos/zdjecie23.png'),
        require('../assets/HomePagePhotos/zdjecie24.png'),
        require('../assets/HomePagePhotos/zdjecie25.png'),
        require('../assets/HomePagePhotos/zdjecie26.png'),
      ];
      const rnd = imgs[Math.floor(Math.random() * imgs.length)];
      setHeaderImg(rnd);

      // brak cleanup
      return;
    }, [])
  );

  // Dodatkowy efekt na orientację (jeśli potrzebny)
  useEffect(() => {
    StatusBar.setBackgroundColor('#333333');
    StatusBar.setBarStyle('light-content');
  }, [isPortrait]);

  // Jeśli fonty jeszcze nie załadowane, pokaż loader
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f2d94e" />
      </View>
    );
  }

  const handlePress = (item: MenuItem) => {
    if (item.action === 'link' && item.url) {
      Linking.openURL(item.url).catch(console.error);
    } else if (item.action === 'navigate' && item.screen) {
      navigation.navigate(item.screen as any);
    }
  };

  const renderHeader = () =>
    headerImg ? (
      <Image source={headerImg} style={styles.headerImg} resizeMode="cover" />
    ) : null;

  const renderFooter = () => (
    <Image
      source={require('../assets/icons/grupabuk.png')}
      style={styles.footerImg}
      resizeMode="contain"
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.key}
        scrollEnabled={false}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
        renderItem={({ item }) => (
          <View style={styles.tileWrapper}>
            <Tile
              title={item.title}
              icon={item.icon}
              accessoryIcon={item.accessoryIcon}
              color="#01503d"
              onPress={() => handlePress(item)}
              // Jeśli Tile używa fontFamily, w Tile style title: { fontFamily: 'LeagueSpartan-Bold', ... }
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e8569' },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0e8569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileWrapper: { marginVertical: 6, width: '90%', alignSelf: 'center' },
  headerImg: { width: '100%', height: windowH * 0.37, marginBottom: 10 },
  footerImg: { width: '100%', height: 140, marginTop: 8 },
});
