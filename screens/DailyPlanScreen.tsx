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

// Mapowanie dni na nazwy dni tygodnia
const weekdayNames: Record<number, string> = {
  1: 'sobota',
  2: 'niedziela',
  3: 'poniedziałek',
  4: 'wtorek',
  5: 'środa',
  6: 'czwartek',
  7: 'piątek',
  8: 'sobota',
  9: 'niedziela',
  10: 'poniedziałek',
  11: 'wtorek',
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
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  // Ustawienia status baru
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

  const renderItem = ({ item }: { item: number }) => (
    <TouchableOpacity
      style={styles.tileWrapper}
      onPress={() => navigation.navigate('DailyPlanDetail', { day: item })}
    >
      <View style={styles.tile}>
        {/* Lewy pasek z numerem dnia */}
        <View style={styles.leftStrip}>
          <Text style={styles.leftText}>Dzień {item}</Text>
        </View>
        {/* Prawa część z nazwą dnia */}
        <View style={styles.rightContent}>
          <Text style={styles.rightText}>{weekdayNames[item]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#333333" barStyle="light-content" translucent={false} />
      <FlatList
        data={days}
        keyExtractor={(item) => item.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#556B2F',
  },
  list: {
    paddingVertical: 16,
  },
  tileWrapper: {
    marginVertical: 8,
    marginHorizontal: 24,
  },
  tile: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  leftStrip: {
    width: '25%',            // zwiększona szerokość do 25%
    backgroundColor: '#F0E68C',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  leftText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  rightContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rightText: {
    fontSize: 18,
    fontWeight: 'bold',      // pogrubione nazwy dni tygodnia
    color: '#333',
  },
});

