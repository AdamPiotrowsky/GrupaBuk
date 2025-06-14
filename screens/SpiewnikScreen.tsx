// screens/SpiewnikScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import songs from './data/songs.json';

export default function SpiewnikScreen() {
  const [query, setQuery] = useState('');
  const navigation = useNavigation<any>();

  const filtered = songs.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Szukaj pieśni..."
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('SpiewnikDetail', { song: item })}
          >
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  search: { marginBottom: 12, padding: 8, borderWidth: 1, borderRadius: 6 },
  item: { paddingVertical: 12 },
  title: { fontSize: 18 },
});
