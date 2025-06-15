// screens/ImportantPhonesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const phoneList = [
  { id: '1', phone: '551 234 123', name: 'Pan Geniu' },
  { id: '2', phone: '377 321 333', name: 'Jan' },
];

export default function ImportantPhonesScreen() {
  return (
    <View style={styles.container}>
      {phoneList.map(item => (
        <Text key={item.id} style={styles.item}>
          {item.id}) {item.phone} – {item.name}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  item: { fontSize: 18, marginVertical: 8 },
});
