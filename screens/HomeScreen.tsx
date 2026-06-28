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
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Tile from '../components/Tile';
import Text from '../components/MyText';

const { height: windowH } = Dimensions.get('window');

type RootStackParamList = {
  Menu: undefined;
  Śpiewnik: undefined;
  DailyPlan: undefined;
  Informator: undefined;
  Autor: undefined;
  Zapisy: undefined;
  Intention: undefined;
};

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Menu'>;

const INSTAGRAM_URL = 'https://www.instagram.com/grupa_buk/';
const FACEBOOK_URL = 'https://www.facebook.com/grupa21pppnjg';

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
    key: 'intencje',
    title: 'INTENCJE',
    action: 'navigate' as const,
    screen: 'Intention',
    icon: require('../assets/icons/form.png'),
  },
] as const;

type MenuItem = typeof menuItems[number];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isPortrait = height >= width;

  const [fontsLoaded] = useFonts({
    'LeagueSpartan-Bold': require('../assets/fonts/LeagueSpartan-Bold.ttf'),
  });

  const [headerImg, setHeaderImg] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');

      const imgs = [
        require('../assets/HomePagePhotos/z1.jpg'),
        require('../assets/HomePagePhotos/z2.jpg'),
        require('../assets/HomePagePhotos/z3.jpg'),
        require('../assets/HomePagePhotos/z4.jpg'),
        require('../assets/HomePagePhotos/z5.jpg'),
        require('../assets/HomePagePhotos/z6.jpg'),
        require('../assets/HomePagePhotos/z7.jpg'),
        require('../assets/HomePagePhotos/z8.jpg'),
        require('../assets/HomePagePhotos/z9.jpg'),
        require('../assets/HomePagePhotos/z10.jpg'),
        require('../assets/HomePagePhotos/z11.jpg'),
        require('../assets/HomePagePhotos/z12.jpg'),
        require('../assets/HomePagePhotos/z13.jpg'),
        require('../assets/HomePagePhotos/z14.jpg'),
        require('../assets/HomePagePhotos/z15.jpg'),
        require('../assets/HomePagePhotos/z16.jpg'),
        require('../assets/HomePagePhotos/z17.jpg'),
        require('../assets/HomePagePhotos/z18.jpg'),
        require('../assets/HomePagePhotos/z19.jpg'),
        require('../assets/HomePagePhotos/z20.jpg'),
        require('../assets/HomePagePhotos/z21.jpg'),
        require('../assets/HomePagePhotos/z22.jpg'),
        require('../assets/HomePagePhotos/z23.jpg'),
        require('../assets/HomePagePhotos/z24.jpg'),
        require('../assets/HomePagePhotos/z25.jpg'),
        require('../assets/HomePagePhotos/z26.png'),
        require('../assets/HomePagePhotos/z27.png'),
        require('../assets/HomePagePhotos/z28.png'),
        require('../assets/HomePagePhotos/z29.png'),
        require('../assets/HomePagePhotos/z30.png'),
        require('../assets/HomePagePhotos/z31.png'),
        require('../assets/HomePagePhotos/z32.png'),
        require('../assets/HomePagePhotos/z33.png'),
        require('../assets/HomePagePhotos/z34.png'),
        require('../assets/HomePagePhotos/z35.png'),
        require('../assets/HomePagePhotos/z36.png'),

      ];

      const rnd = imgs[Math.floor(Math.random() * imgs.length)];
      setHeaderImg(rnd);

      return;
    }, [])
  );

  useEffect(() => {
    StatusBar.setBackgroundColor('#333333');
    StatusBar.setBarStyle('light-content');
  }, [isPortrait]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f2d94e" />
      </View>
    );
  }

  const openLink = (url: string) => {
    Linking.openURL(url).catch(console.error);
  };

  const handlePress = (item: MenuItem) => {
    navigation.navigate(item.screen as any);
  };

  const renderInstagramIcon = () => (
    <View style={styles.instagramCamera}>
      <View style={styles.instagramLens} />
      <View style={styles.instagramDot} />
    </View>
  );

  const renderFacebookIcon = () => (
    <Text style={styles.facebookIcon}>f</Text>
  );

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
              color="#01503d"
              onPress={() => handlePress(item)}
            />
          </View>
        )}
      />

      {/* Social media — zakładki nad zdjęciem, przyklejone do prawej krawędzi */}
      <View style={[styles.socialFloating, { top: insets.top + 18 }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => openLink(FACEBOOK_URL)}
          style={styles.socialTabShadow}
        >
          <View style={[styles.socialTab, styles.facebookTab]}>
            {renderFacebookIcon()}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => openLink(INSTAGRAM_URL)}
          style={styles.socialTabShadow}
        >
          <LinearGradient
            colors={['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.socialTab}
          >
            {renderInstagramIcon()}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const SOCIAL_TAB_WIDTH = 42;
const SOCIAL_TAB_HEIGHT = 42;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e8569',
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#0e8569',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tileWrapper: {
    marginVertical: 6,
    width: '90%',
    alignSelf: 'center',
  },

  headerImg: {
    width: '100%',
    height: windowH * 0.37,
    marginBottom: 10,
  },

  footerImg: {
    width: '100%',
    height: 140,
    marginTop: 8,
  },

  socialFloating: {
    position: 'absolute',
    right: 0,
    zIndex: 999,
    elevation: 999,
    gap: 7,
  },

  socialTabShadow: {
    width: SOCIAL_TAB_WIDTH,
    height: SOCIAL_TAB_HEIGHT,
    borderTopLeftRadius: SOCIAL_TAB_HEIGHT / 2,
    borderBottomLeftRadius: SOCIAL_TAB_HEIGHT / 2,
    elevation: 10,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 4,
  },

  socialTab: {
    width: SOCIAL_TAB_WIDTH,
    height: SOCIAL_TAB_HEIGHT,
    borderTopLeftRadius: SOCIAL_TAB_HEIGHT / 2,
    borderBottomLeftRadius: SOCIAL_TAB_HEIGHT / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },

  facebookTab: {
    backgroundColor: '#1877f2',
  },

  facebookIcon: {
    color: '#fff',
    fontSize: 35,
    fontWeight: 'bold',
    lineHeight: 39,
    marginTop: 6,
    maxFontSizeMultiplier: 1,
  },

  instagramCamera: {
    width: 24,
    height: 24,
    borderWidth: 2.4,
    borderColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  instagramLens: {
    width: 9,
    height: 9,
    borderWidth: 2.2,
    borderColor: '#fff',
    borderRadius: 999,
  },

  instagramDot: {
    position: 'absolute',
    top: 2.2,
    right: 2.2,
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
});