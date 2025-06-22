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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import Tile from '../components/Tile';

const { height: windowH } = Dimensions.get('window');

type RootStackParamList = {
  Menu: undefined;
  Śpiewnik: undefined;
  DailyPlan: undefined;
  Informator: undefined;
  Autor: undefined;
};
type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Menu'>;

const ZAPISY_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeYdHi8-eIwPcN5IuHnF34laMaoQSj7OOt7jLiNGNaMBuTyZw/viewform';

const menuItems = [
  { key: 'spiewnik',   title: 'ŚPIEWNIK',                 action: 'navigate', screen: 'Śpiewnik',  icon: require('../assets/spiewnik.png')  },
  { key: 'plan',       title: 'INFORMACJE NA KAŻDY DZIEŃ', action: 'navigate', screen: 'DailyPlan', icon: require('../assets/plan.png')      },
  { key: 'informator', title: 'CO ZABRAĆ NA PIELGRZYMKĘ',  action: 'navigate', screen: 'Informator',icon: require('../assets/checklist.png') },
  { key: 'zapisy',     title: 'ZAPISY',                    action: 'link',     url: ZAPISY_URL,    icon: require('../assets/form.png'), accessoryIcon: require('../assets/out.png')},
] as const;
type MenuItem = typeof menuItems[number];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const insets     = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isPortrait = height >= windowH;
  const [headerImg, setHeaderImg] = useState<any>(null);

  useEffect(() => {
    Font.loadAsync({
      'LeagueSpartan-Regular': require('../assets/fonts/LeagueSpartan-Regular.ttf'),
      'LeagueSpartan-Bold':    require('../assets/fonts/LeagueSpartan-Bold.ttf'),
    });
  }, []);

  // losowanie nagłówka przy każdym focusie ekranu
  useFocusEffect(
    useCallback(() => {
      const imgs = [
        require('../assets/zdjęcie1.png'),
        require('../assets/zdjęcie2.png'),
        require('../assets/zdjęcie3.png'),
        require('../assets/zdjęcie4.png'),
        require('../assets/zdjęcie5.png'),
        require('../assets/zdjęcie6.png'),
        require('../assets/zdjęcie7.png'),
        require('../assets/zdjęcie8.png'),
        require('../assets/zdjęcie9.png'),
        require('../assets/zdjęcie10.png'),
        require('../assets/zdjęcie11.png'),
        require('../assets/zdjęcie12.png'),
        require('../assets/zdjęcie13.png'),
        require('../assets/zdjęcie14.png'),
        require('../assets/zdjęcie15.png'),
        require('../assets/zdjęcie16.png'),
        require('../assets/zdjęcie17.png'),
        require('../assets/zdjęcie18.png'),
        require('../assets/zdjęcie19.png'),
        require('../assets/zdjęcie20.png'),
        require('../assets/zdjęcie21.png'),
        require('../assets/zdjęcie22.png'),
        require('../assets/zdjęcie23.png'),
        require('../assets/zdjęcie24.png'),
        require('../assets/zdjęcie25.png'),
        require('../assets/zdjęcie26.png'),
      ];
      setHeaderImg(imgs[Math.floor(Math.random() * imgs.length)]);
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');
    }, [])
  );

  useEffect(() => {
    StatusBar.setBackgroundColor('#333333');
    StatusBar.setBarStyle('light-content');
  }, [isPortrait]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');
    }, [])
  );

  const handlePress = (item: MenuItem) => {
    if (item.action === 'link') {
      Linking.openURL(item.url!).catch(console.error);
    } else {
      navigation.navigate(item.screen as any);
    }
  };

  const renderHeader = () =>
    headerImg && (
      <Image
        source={headerImg}
        style={styles.headerImg}
        resizeMode="cover"
      />
    );

  const renderFooter = () => (
    <Image
      source={require('../assets/grupabuk.png')}
      style={styles.footerImg}
      resizeMode="contain"
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={false}
        // rozciągnij listę na całą dostępną wysokość
        style={{ flex: 1 }}
        data={menuItems}
        keyExtractor={(item) => item.key}
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
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#0e8569' },
  tileWrapper: { marginVertical: 6, marginHorizontal: 16, width: '90%' },
  headerImg:   { width: '100%', height: windowH * 0.35 , marginBottom: 12 },
  footerImg:   { width: '100%', height: 140,  },
});
