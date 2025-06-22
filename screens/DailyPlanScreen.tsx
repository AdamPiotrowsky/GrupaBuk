// screens/DailyPlanScreen.tsx
import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mapowanie dni na nazwy dni tygodnia
const weekdayNames: Record<number, string> = {
  1: 'sobota',  2: 'niedziela', 3: 'poniedziałek', 4: 'wtorek',
  5: 'środa',   6: 'czwartek', 7: 'piątek',     8: 'sobota',
  9: 'niedziela',10: 'poniedziałek',11: 'wtorek',
};

type RootStackParamList = {
  Menu: undefined;
  Śpiewnik: undefined;
  DailyPlan: undefined;
  DailyPlanDetail: { day: number };
  ImportantPhones: undefined;
  Informator: undefined;
  Zapisy: undefined;
};

type DailyPlanNavProp = NativeStackNavigationProp<RootStackParamList, 'DailyPlan'>;

const days = Array.from({ length: 11 }, (_, i) => i + 1);

export default function DailyPlanScreen() {
  const navigation = useNavigation<DailyPlanNavProp>();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isPortrait = height >= width;

  useEffect(() => {
    StatusBar.setBackgroundColor('#333333');
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(false);
  }, [isPortrait]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(false);
    }, [])
  );


  // Jeśli chcesz dodać tekst przed numerem dnia, np. "Dzień X. ..."
  const renderItem = ({ item }: { item: number }) => (
    <TouchableOpacity
      style={styles.tile}
      onPress={() => navigation.navigate('DailyPlanDetail', { day: item })}
    >
      <Text style={styles.tileText}>{`Dzień ${item}.   -   ${weekdayNames[item]}`}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#333333" barStyle="light-content" translucent={false} />
      <FlatList
        data={days}
        keyExtractor={item => item.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e8569',
  },
  tile: {
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
  tileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f2d94e',
    textAlign: 'left',
  },
});
