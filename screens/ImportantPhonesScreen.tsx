// screens/ImportantPhonesScreen.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  Linking,
} from 'react-native';
import Tile from '../components/Tile';

// Lista telefonów
type PhoneEntry = { key: string; name: string; phone: string; icon: any };
const phoneList: PhoneEntry[] = [
  { key: '1', phone: '551 234 123', name: 'Pan Geniu', icon: require('../assets/icon_phone.png') },
  { key: '2', phone: '377 321 333', name: 'Jan',       icon: require('../assets/icon_phone.png') },
];

export default function ImportantPhonesScreen() {
  const makeCall = (phone: string) => {
    const cleaned = phone.replace(/\s+/g, '');
    Linking.openURL(`tel:${cleaned}`).catch(err => console.error('Failed to open dialer', err));
  };

  return (
    <>
      <StatusBar backgroundColor="#333333" barStyle="light-content" />
      <View style={styles.container}>
        <FlatList
          data={phoneList}
          keyExtractor={item => item.key}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.tileWrapper}>
              <Tile
                title={`${item.phone} – ${item.name}`}
                icon={item.icon}
                color="#F0E68C"
                onPress={() => makeCall(item.phone)}
                titleStyle={styles.titleText}
              />
            </View>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#556B2F',
  },
  list: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  tileWrapper: {
    width: '90%',
    marginVertical: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
