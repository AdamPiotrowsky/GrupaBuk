// screens/SpiewnikScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
  Modal,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Text from '../components/MyText';      // Twój komponent Text z allowFontScaling=false
import songs from '../data/songs.json';

type Song = { id: string; title: string; text: string };

type RootStackParamList = {
  Menu: undefined;
  Śpiewnik: undefined;
  SpiewnikDetail: { song: Song };
  Playlist: { listName: string };
  Autor: undefined;
};
type SpiewnikNavProp = NativeStackNavigationProp<RootStackParamList, 'Śpiewnik'>;

const FIXED_LISTS = ['Zestaw 1', 'Zestaw 2', 'Zestaw 3', 'Zestaw 4'];

/** 
 * Uproszczona normalizacja:
 * - na małe litery
 * - rozbicie diakrytyków Unicode
 * - usunięcie znaków diakrytycznych
 * - usunięcie podstawowych przystanków
 */
function normalize(str: string) {
  return str
    .toLowerCase()
    // ręcznie zamieniamy ł → l
    .replace(/ł/g, 'l')
    // teraz rozbijamy pozostałe diakrytyki
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // usuwamy interpunkcję
    .replace(/[.,!?…:;"'()\-]/g, '')
    .trim();
}


export default function SpiewnikScreen() {
  const navigation = useNavigation<SpiewnikNavProp>();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isPortrait = height >= width;

  const [query, setQuery] = useState('');
  const [listsVisible, setListsVisible] = useState(false);

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

  // znormalizowany query
  const normQ = normalize(query);

  // filtr
  const filtered = songs.filter(s => {
    const haystack = normalize(s.title + ' ' + s.text);
    return normQ === '' || haystack.includes(normQ);
  });

  return (
    <View style={styles.container}>
      {/* wyszukiwarka + Listy */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Szukaj fragmentu..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity
          style={styles.listsButton}
          onPress={() => setListsVisible(true)}
        >
          <Text style={styles.listsButtonText}>Listy</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.songTile}
            onPress={() => navigation.navigate('SpiewnikDetail', { song: item })}
          >
            <Text style={styles.songText}>
              {`${item.id}. ${item.title}`}
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.thanksButton}
            onPress={() => navigation.navigate('Autor')}
          >
            <Text style={styles.thanksButtonText}>...</Text>
          </TouchableOpacity>
        )}
      />

      {/* modal wyboru zestawów */}
      <Modal
        visible={listsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setListsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setListsVisible(false)}
        >
          <View style={styles.modalBox}>
            {FIXED_LISTS.map(name => (
              <TouchableOpacity
                key={name}
                style={styles.modalItem}
                onPress={() => {
                  setListsVisible(false);
                  navigation.navigate('Playlist', { listName: name });
                }}
              >
                <Text style={styles.modalItemText}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e8569' },

  searchRow: {
    flexDirection: 'row',
    margin: 16,
  },
  searchInput: {
    flex: 0.8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    color: '#000',
  },
  listsButton: {
    flex: 0.2,
    backgroundColor: '#f2d94e',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listsButtonText: {
    color: '#01503d',
    fontWeight: 'bold',
    fontSize: 16,
  },

  songTile: {
    backgroundColor: '#01503d',
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  songText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f2d94e',
    textAlign: 'left',
  },

  thanksButton: {
    backgroundColor: '#f2d94e',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  thanksButtonText: {
    color: '#01503d',
    fontWeight: 'bold',
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '70%',
    backgroundColor: '#0e8569',
    borderRadius: 12,
    paddingVertical: 8,
  },
  modalItem: {
    paddingVertical: 14,
  },
  modalItemText: {
    fontSize: 18,
    color: '#f2d94e',
    textAlign: 'center',
  },
});
