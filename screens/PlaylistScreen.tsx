// screens/PlaylistScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import songs from './data/piesni.json';

type Song = { id: string; title: string; text: string };

type RootStackParamList = {
  Playlist: { listName: string };
  SpiewnikDetail: { song: Song };
};

type PlaylistRouteProp = RouteProp<RootStackParamList, 'Playlist'>;
type PlaylistNavProp = NativeStackNavigationProp<RootStackParamList, 'Playlist'>;

export default function PlaylistScreen({
  route,
  navigation,
}: {
  route: PlaylistRouteProp;
  navigation: PlaylistNavProp;
}) {
  const { listName } = route.params;
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isPortrait = height >= width;

  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);

  // przy focusie pobierz z AsyncStorage listę ID
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(false);

      (async () => {
        const json = await AsyncStorage.getItem(`playlist-${listName}`) || '[]';
        const ids: string[] = JSON.parse(json);
        const filtered = (songs as Song[]).filter(s => ids.includes(s.id));
        setPlaylistSongs(filtered);
      })();
    }, [listName])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={playlistSongs}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.songTile}
            onPress={() => navigation.navigate('SpiewnikDetail', { song: item })}
          >
            <Text style={styles.songText}>{`${item.id}. ${item.title}`}</Text>
          </TouchableOpacity>
        )}
      />
      {!playlistSongs.length && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Brak piosenek w tej liście</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e8569' },
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
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#fff', fontSize: 16 },
});
