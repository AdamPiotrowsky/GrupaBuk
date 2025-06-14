// screens/SpiewnikDetailScreen.tsx
import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

export default function SpiewnikDetailScreen({ route }: any) {
  const { song } = route.params;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.text}>{song.text}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  text: { fontSize: 16, lineHeight: 24 },
});
