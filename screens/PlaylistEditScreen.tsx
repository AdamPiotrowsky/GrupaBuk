// screens/PlaylistEditScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import songs from '../data/songs.json'; // upewnij się, że to mówi o właściwej ścieżce

type Song = { id: string; title: string; text: string };

type RootStackParamList = {
  Playlist: { listName: string };
  PlaylistEdit: { listName: string };
  SpiewnikDetail: { song: Song };
  // ... inne ekrany
};

type PlaylistEditRouteProp = RouteProp<RootStackParamList, 'PlaylistEdit'>;
type PlaylistEditNavProp = NativeStackNavigationProp<RootStackParamList, 'PlaylistEdit'>;

export default function PlaylistEditScreen({
  route,
}: {
  route: PlaylistEditRouteProp;
  navigation: PlaylistEditNavProp;
}) {
  const navigation = useNavigation<PlaylistEditNavProp>();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isPortrait = height >= width;

  const { listName } = route.params;

  // Zestaw ID zaznaczonych piosenek
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Przy mount: ładujemy istniejące IDs z AsyncStorage
  useEffect(() => {
    navigation.setOptions({ title: `Edycja: ${listName}` });
    (async () => {
      try {
        const json = await AsyncStorage.getItem(`playlist-${listName}`);
        if (json) {
          const arr: string[] = JSON.parse(json);
          if (Array.isArray(arr)) {
            setSelectedIds(new Set(arr));
          }
        } else {
          setSelectedIds(new Set());
        }
      } catch (e) {
        console.warn('Błąd wczytywania playlisty:', e);
        setSelectedIds(new Set());
      }
    })();
  }, [listName, navigation]);

  // StatusBar styl
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(false);
    }, [])
  );

  // Toggle zaznaczenia ID
  const toggleId = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Zapis: zapisujemy do AsyncStorage i goBack
  const saveAndGoBack = async () => {
    try {
      const arr = Array.from(selectedIds);
      await AsyncStorage.setItem(`playlist-${listName}`, JSON.stringify(arr));
    } catch (e) {
      console.warn('Błąd zapisu playlisty:', e);
    }
    navigation.goBack();
  };

  // Render pojedynczej piosenki z checkboxem
  const renderItem = ({ item }: { item: Song }) => {
    const isSelected = selectedIds.has(item.id);
    return (
      <TouchableOpacity
        style={styles.songRow}
        onPress={() => toggleId(item.id)}
      >
        {/* Checkbox prosty: kwadrat z tick lub puste */}
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkboxTick}>✓</Text>}
        </View>
        <Text style={styles.songText}>{`${item.id}. ${item.title}`}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Lista wszystkich piosenek */}
      <FlatList
        data={songs as Song[]}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16, paddingTop: 8 }}
      />

      {/* Przyciski Zapisz / Anuluj */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Anuluj</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={saveAndGoBack}>
          <Text style={styles.saveButtonText}>Zapisz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e8569' },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#01503d',
    borderRadius: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#f2d94e',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#f2d94e',
  },
  checkboxTick: {
    color: '#01503d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  songText: {
    flex: 1,
    fontSize: 16,
    color: '#f2d94e',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#333',
    backgroundColor: '#01503d',
  },
  cancelButton: {
    backgroundColor: '#c0392b',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#f2d94e',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#01503d',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
