import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import songs from './data/songs.json';

// Typy piosenek, dopasuj do struktury w JSON-ie
type Song = {
  id: string;
  title: string;
  text: string;
};

type RootStackParamList = {
  Menu: undefined;
  Śpiewnik: undefined;
  SpiewnikDetail: { song: Song };
  // ...inne ekrany
};

type SpiewnikNavProp = NativeStackNavigationProp<RootStackParamList, 'Śpiewnik'>;

export default function SpiewnikScreen() {
  const navigation = useNavigation<SpiewnikNavProp>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  const [query, setQuery] = useState('');

  // StatusBar
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

  // Filtrujemy listę piosenek wg tytułu
  const filtered: Song[] = songs.filter((s: Song) =>
    s.title.toLowerCase().includes(query.toLowerCase())
  );

  const renderItem = ({ item, index }: { item: Song; index: number }) => {
    // Numer piosenki: można użyć item.id lub index+1
    const number = item.id ?? String(index + 1);
    return (
      <TouchableOpacity
        style={styles.tileWrapper}
        onPress={() => navigation.navigate('SpiewnikDetail', { song: item })}
      >
        <View style={styles.tile}>
          {/* Lewy pasek z numerem piosenki */}
          <View style={styles.leftStrip}>
            <Text style={styles.leftText}>{number}</Text>
          </View>
          {/* Główna część z tytułem */}
          <View style={styles.rightContent}>
            <Text style={styles.rightText}>{item.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#333333" barStyle="light-content" translucent={false} />

      <TextInput
        style={styles.search}
        placeholder="Szukaj pieśni..."
        placeholderTextColor="#666"
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        // dodatkowy padding u dołu, by ostatni kafelek nie był zasłonięty
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 50 }]}
        ListFooterComponent={() => <View style={{ height: insets.bottom + 50 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#556B2F',
  },
  search: {
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    fontSize: 16,
    color: '#000',
  },
  list: {
    // paddingVertical: 0 albo małe, żeby lista zaczynała się zaraz pod search
  },
  tileWrapper: {
    marginVertical: 4,
    marginHorizontal: 16,
    width: '90%', // albo '100%' z marginesem w parent, zależnie od preferencji
    alignSelf: 'center',
  },
  tile: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  leftStrip: {
    width: '15%', // mały pasek po lewej
    backgroundColor: '#F0E68C',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  leftText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rightContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  rightText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
