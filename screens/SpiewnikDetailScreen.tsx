// screens/SpiewnikDetailScreen.tsx
import React, { useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SpiewnikDetailScreen({ route }: any) {
  const { song } = route.params as { song: { title: string; text: string } };
  const insets = useSafeAreaInsets();

  // StatusBar konfiguracja
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(false);
    }, [])
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: insets.bottom + 16 },
      ]}
    >
      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.text}>{song.text}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#556B2F',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#f0f0f0',
  },
});
