// screens/DailyPlanScreen.tsx
import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/MyText';
import dailyPlans from '../data/dailyplan.json';

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

type Plan = {
  day: number;
  date: string;
  weekday: string;
};

export default function DailyPlanScreen() {
  const navigation = useNavigation<DailyPlanNavProp>();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isPortrait = height >= width;

  const plans = dailyPlans as Plan[];

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

  const renderItem = ({ item }: { item: Plan }) => {
    return (
      <TouchableOpacity
        style={styles.tile}
        onPress={() => navigation.navigate('DailyPlanDetail', { day: item.day })}
      >
        <Text style={styles.tileText}>
          {`Dzień ${item.day}.  –  ${item.date.trim()} – ${item.weekday}`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#333333" barStyle="light-content" translucent={false} />

      <FlatList
        data={plans}
        keyExtractor={item => item.day.toString()}
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
    maxFontSizeMultiplier: 1,
    color: '#f2d94e',
    textAlign: 'left',
  },
});