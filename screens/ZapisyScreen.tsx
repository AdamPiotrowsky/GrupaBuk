import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SpiewnikScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>zapisy</Text>
      {/* tutaj dodawaj treść */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' }
});
