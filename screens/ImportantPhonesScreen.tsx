// screens/ImportantPhonesScreen.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  Linking,
  useWindowDimensions,
} from 'react-native';
import Tile from '../components/Tile';

type PhoneEntry = {
  key: string;
  name: string;
  phone: string;
  icon: any;
};

const phoneList: PhoneEntry[] = [
  { key: '1', phone: '111 222 333', name: 'Pan Geniu', icon: require('../assets/icons/icon_phone.png') },
  { key: '2', phone: '444 555 666', name: 'Ks Jan',       icon: require('../assets/icons/icon_phone.png') },
  { key: '3', phone: '777 888 999', name: 'Pan Marek',     icon: require('../assets/icons/icon_phone.png') },
  { key: '4', phone: '000 111 222', name: 'Szef drogówki',     icon: require('../assets/icons/icon_phone.png') },
];


export default function ImportantPhonesScreen() {
  const insets = useWindowDimensions();

  const makeCall = (phone: string) => {
    const cleaned = phone.replace(/\s+/g, '');
    Linking.openURL(`tel:${cleaned}`).catch(err => console.error('Failed to open dialer', err));
  };

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#333333" barStyle="light-content" />
      <FlatList
        data={phoneList}
        keyExtractor={item => item.key}
        contentContainerStyle={[styles.list]}
        renderItem={({ item }) => (
          <View style={styles.tileWrapper}>
            <Tile
              title={`${item.phone} – ${item.name}`}
              icon={item.icon}
              color="#01503d"                    // ciemnozielone tło kafelka
              titleStyle={styles.titleText}     // żółty tekst
              onPress={() => makeCall(item.phone)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0e8569',  // spójne tło ekranu
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
    color: '#f2d94e',            // żółty, jak w reszcie aplikacji
  },
});
