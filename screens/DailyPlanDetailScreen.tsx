// screens/DailyPlanDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import dailyPlans from './data/dailyplan.json';

type Plan = {
  day: number;
  date: string;
  weekday: string;
  intention: string;
  start:   { location: string; time: string };
  finish:  { location: string; time: string };
  mass:    { location: string; time: string };
  meal:    { location: string; time: string };
  image:   string; // e.g. "day1.jpg"
};

const { width: windowWidth } = Dimensions.get('window');

// Mapowanie nazwy pliku z JSON na require()
const planImages: Record<string, any> = {
  'day1.jpg': require('../assets/plans/day1.jpg'),
  'day2.jpg': require('../assets/plans/day2.jpg'),
  'day3.jpg': require('../assets/plans/day3.jpg'),
  'day4.jpg': require('../assets/plans/day4.jpg'),
  'day5.jpg': require('../assets/plans/day5.jpg'),
  'day6.jpg': require('../assets/plans/day6.jpg'),
  'day7.jpg': require('../assets/plans/day7.jpg'),
  'day8.jpg': require('../assets/plans/day8.jpg'),
  'day9.jpg': require('../assets/plans/day9.jpg'),
  'day10.jpg': require('../assets/plans/day10.jpg'),
  'day11.jpg': require('../assets/plans/day11.jpg'),
};

export default function DailyPlanDetailScreen({ route }: any) {
  const { day } = route.params as { day: number };
  const plan = (dailyPlans as Plan[]).find(p => p.day === day);

  if (!plan) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No data for Day {day}</Text>
      </View>
    );
  }

  const imageSource = planImages[plan.image];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.dateText}>
        {plan.date} – {plan.weekday}
      </Text>
      <Text style={styles.intention}>{plan.intention}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Start</Text>
        <Text style={styles.time}>{plan.start.time}</Text>
        <Text style={styles.place}>{plan.start.location}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Meta</Text>
        <Text style={styles.time}>{plan.finish.time}</Text>
        <Text style={styles.place}>{plan.finish.location}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Msza</Text>
        <Text style={styles.time}>{plan.mass.time}</Text>
        <Text style={styles.place}>{plan.mass.location}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Posiłek</Text>
        <Text style={styles.time}>{plan.meal.time}</Text>
        <Text style={styles.place}>{plan.meal.location}</Text>
      </View>

      {imageSource && (
        <Image
          source={imageSource}
          style={styles.planImage}
          resizeMode="cover"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#556B2F',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  intention: {
    fontSize: 20,
    color: '#f0e68c',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    width: 80,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  time: {
    width: 70,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  place: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
  },
  planImage: {
    width: windowWidth - 32,
    height: (windowWidth - 32) * 0.75,
    marginTop: 24,
    borderRadius: 12,
  },
});
