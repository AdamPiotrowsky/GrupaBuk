// screens/DailyPlanDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
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
};

export default function DailyPlanDetailScreen({ route }: any) {
  const { day } = route.params as { day: number };
  const plan = (dailyPlans as Plan[]).find(p => p.day === day);

  if (!plan) {
    return (
      <View style={styles.center}>
        <Text>No data for Day {day}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        {plan.date} – {plan.weekday} {'\u2013'} {plan.intention}
      </Text>

      {/* Start */}
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Image source={require('../assets/icon.png')} style={styles.icon} />
          <Text style={styles.label}>Start</Text>
        </View>
        <Text style={styles.details}>
          {plan.start.location} • {plan.start.time}
        </Text>
      </View>

      {/* Finish */}
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Image source={require('../assets/icon.png')} style={styles.icon} />
          <Text style={styles.label}>Finish</Text>
        </View>
        <Text style={styles.details}>
          {plan.finish.location} • {plan.finish.time}
        </Text>
      </View>

      {/* Mass */}
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Image source={require('../assets/icon.png')} style={styles.icon} />
          <Text style={styles.label}>Mass</Text>
        </View>
        <Text style={styles.details}>
          {plan.mass.location} • {plan.mass.time}
        </Text>
      </View>

      {/* Meal */}
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Image source={require('../assets/icon.png')} style={styles.icon} />
          <Text style={styles.label}>Meal</Text>
        </View>
        <Text style={styles.details}>
          {plan.meal.location} • {plan.meal.time}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:    { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  row:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  labelContainer: { flexDirection: 'row', alignItems: 'center' },
  icon:      { width: 24, height: 24, marginRight: 8 },
  label:     { fontSize: 16, fontWeight: '600' },
  details:   { fontSize: 16 },
});