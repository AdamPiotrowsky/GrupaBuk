import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../components/MyText';

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
