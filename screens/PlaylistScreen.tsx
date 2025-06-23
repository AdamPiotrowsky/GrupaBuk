// screens/PlaylistScreen.tsx
import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import songs from '../data/songs.json'; // upewnij się, że ścieżka jest ok

type Song = { id: string; title: string; text: string };

type RootStackParamList = {
  Playlist: { listName: string };
  PlaylistEdit: { listName: string };
  SpiewnikDetail: { song: Song };
};

type PlaylistRouteProp = RouteProp<RootStackParamList, 'Playlist'>;
type PlaylistNavProp = NativeStackNavigationProp<RootStackParamList, 'Playlist'>;

export default function PlaylistScreen({
  route,
}: {
  route: PlaylistRouteProp;
  navigation: PlaylistNavProp;
}) {
  const navigation = useNavigation<PlaylistNavProp>();
  const { listName } = route.params;
  const insets = useSafeAreaInsets();

  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);

  // Za każdym razem, gdy ekran się pojawia (focus), wczytujemy listę z AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(false);

      (async () => {
        try {
          const json = await AsyncStorage.getItem(`playlist-${listName}`);
          let ids: string[] = [];
          if (json) {
            const parsed = JSON.parse(json);
            if (Array.isArray(parsed)) ids = parsed;
          }
          const filtered = (songs as Song[]).filter(s => ids.includes(s.id));
          setPlaylistSongs(filtered);
        } catch (e) {
          console.warn('Błąd wczytywania playlisty:', e);
          setPlaylistSongs([]);
        }
      })();
    }, [listName])
  );

  // Navigacja do ekranu edycji
  const onAddPress = () => {
    navigation.navigate('PlaylistEdit', { listName });
  };

  // Usuwanie pojedynczej piosenki z listy
  const removeSong = (songId: string) => {
    Alert.alert(
      'Usuń utwór',
      'Czy na pewno chcesz usunąć tę piosenkę z listy?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              const json = await AsyncStorage.getItem(`playlist-${listName}`);
              let ids: string[] = [];
              if (json) {
                const parsed = JSON.parse(json);
                if (Array.isArray(parsed)) ids = parsed;
              }
              const newIds = ids.filter(id => id !== songId);
              await AsyncStorage.setItem(`playlist-${listName}`, JSON.stringify(newIds));
              // Odśwież stan
              setPlaylistSongs(prev => prev.filter(s => s.id !== songId));
            } catch (e) {
              console.warn('Błąd usuwania utworu:', e);
            }
          },
        },
      ]
    );
  };

  // Usunięcie wszystkich utworów z listy
  const clearAll = () => {
    if (playlistSongs.length === 0) return;
    Alert.alert(
      'Usuń wszystkie',
      'Czy na pewno chcesz usunąć wszystkie piosenki z tej listy?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń wszystkie',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.setItem(`playlist-${listName}`, JSON.stringify([]));
              setPlaylistSongs([]);
            } catch (e) {
              console.warn('Błąd czyszczenia playlisty:', e);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Song }) => (
    <View style={styles.songRow}>
      <TouchableOpacity
        style={styles.songInfo}
        onPress={() => navigation.navigate('SpiewnikDetail', { song: item })}
      >
        <Text style={styles.songText}>{`${item.id}. ${item.title}`}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeBtn} onPress={() => removeSong(item.id)}>
        <Text style={styles.removeBtnText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Nagłówek z nazwą playlisty i przyciskami */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{listName}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={onAddPress}>
          <Text style={styles.headerButtonText}>Dodaj utwory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={clearAll}>
          <Text style={styles.headerButtonText}>Usuń wszystkie</Text>
        </TouchableOpacity>
      </View>

      {/* Lista piosenek */}
      <FlatList
        data={playlistSongs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Brak piosenek w tej liście</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e8569',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#01503d',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f2d94e',
  },
  headerButton: {
    backgroundColor: '#f2d94e',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  headerButtonText: {
    color: '#01503d',
    fontSize: 14,
    fontWeight: 'bold',
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#01503d',
    borderRadius: 8,
    overflow: 'hidden',
  },
  songInfo: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  songText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f2d94e',
  },
  removeBtn: {
    backgroundColor: '#c0392b',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  empty: {
    flex: 1,
    marginTop: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
});
