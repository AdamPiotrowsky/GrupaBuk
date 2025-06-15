import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Linking,
  Image,
  Dimensions,
  StatusBar,
  Text,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Tile from '../components/Tile';

const { height: windowHeight } = Dimensions.get('window');

type RootStackParamList = {
  Menu: undefined;
  Śpiewnik: undefined;
  DailyPlan: undefined;
  ImportantPhones: undefined;
  Informator: undefined;
  Autor: undefined;
};

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Menu'>;

const ZAPISY_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeYdHi8-eIwPcN5IuHnF34laMaoQSj7OOt7jLiNGNaMBuTyZw/viewform';
const STRONA_URL = 'http://grupa21.archpoznan.pl/';

const menuItems = [
  { key: 'spiewnik', title: 'Śpiewnik', action: 'navigate' as const, screen: 'Śpiewnik', icon: require('../assets/icon_spiewnik.png') },
  { key: 'plan', title: 'Plan dnia', action: 'navigate' as const, screen: 'DailyPlan', icon: require('../assets/icon_mapa.png') },
  { key: 'telefony', title: 'Ważne telefony', action: 'navigate' as const, screen: 'ImportantPhones', icon: require('../assets/icon_phone.png') },
  { key: 'informator', title: 'Informator', action: 'navigate' as const, screen: 'Informator', icon: require('../assets/icon_roz.png') },
  { key: 'autor', title: 'Autor', action: 'navigate' as const, screen: 'Autor', icon: require('../assets/icon_autor.png') },
  { key: 'strona', title: 'Grupowa strona', action: 'link' as const, url: STRONA_URL, icon: require('../assets/logo.png'), accessoryIcon: require('../assets/przegladarka.png') },
  { key: 'zapisy', title: 'Zapisy', action: 'link' as const, url: ZAPISY_URL, icon: require('../assets/favicon.png'), accessoryIcon: require('../assets/przegladarka.png') },
] as const;

import type { ImageSourcePropType } from 'react-native';

type MenuItem = typeof menuItems[number] & { accessoryIcon?: ImageSourcePropType };

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  useEffect(() => {
    StatusBar.setBackgroundColor('#333333');
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(false);
  }, [isPortrait]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(false);
    }, [])
  );

  const handlePress = (item: MenuItem) => {
    if (item.action === 'link' && item.url) {
      Linking.openURL(item.url).catch(console.error);
    } else if (item.action === 'navigate' && item.screen) {
      navigation.navigate(item.screen);
    }
  };

  const renderHeader = () => (
    <View style={styles.logoContainer}>
      <Image
        source={require('../assets/logo1.png')}
        style={styles.logo}
        resizeMode="cover"
      />
      <Text style={styles.logoText}>Grupa Buk</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#333333" barStyle="light-content" translucent={false} />
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.tileWrapper}>
            <Tile
              title={item.title}
              icon={item.icon}
              color="#F0E68C"
              accessoryIcon={item.accessoryIcon}
              onPress={() => handlePress(item)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#556B2F',
  },
  logoContainer: {
    width: '100%',
    height: windowHeight * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    position: 'absolute',
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  list: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  tileWrapper: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
});