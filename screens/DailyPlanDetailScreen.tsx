// screens/DailyPlanDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import dailyPlans from './data/dailyplan.json';

type Plan = {
  day: number;
  date: string;
  weekday: string;
  intention: string;
  start: { location: string; time: string };
  finish: { location: string; time: string };
  mass: { location: string; time: string };
  meal: { location: string; time: string };
  image: string;
};

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

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

// Mapowanie polskich etykiet
const labelMap: Record<string, string> = {
  start: 'Start',
  finish: 'Meta',
  mass: 'Msza',
  meal: 'Posiłek',
};

export default function DailyPlanDetailScreen({ route }: any) {
  const { day } = route.params as { day: number };
  const plan = (dailyPlans as Plan[]).find(p => p.day === day);
  const [modalVisible, setModalVisible] = useState(false);

  if (!plan) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No data for Day {day}</Text>
      </View>
    );
  }

  const imageSource = planImages[plan.image];

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#333333" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.dateText}>{plan.date} – {plan.weekday}</Text>
        <Text style={styles.intention}>{plan.intention}</Text>

        {(['start', 'finish', 'mass', 'meal'] as (keyof typeof labelMap)[]).map(key => {
          const item = plan[key];
          return (
            <View key={key} style={styles.infoRow}>
              <Text style={styles.label}>{labelMap[key]}</Text>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.place}>{item.location}</Text>
            </View>
          );
        })}

        {imageSource && (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={imageSource} style={styles.planImage} resizeMode="cover" />
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.modalSideArea} onPress={() => setModalVisible(false)} />
          <ScrollView
            contentContainerStyle={styles.modalContent}
            maximumZoomScale={3}
            minimumZoomScale={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Image source={imageSource} style={styles.modalImage} resizeMode="contain" />
          </ScrollView>
          <TouchableOpacity style={styles.modalSideArea} onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#556B2F' },
  container: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#556B2F' },
  errorText: { color: '#fff', fontSize: 18 },
  dateText: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  intention: { fontSize: 20, color: '#f0e68c', textAlign: 'center', marginBottom: 16, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  label: { width: 80, fontSize: 18, fontWeight: '600', color: '#fff' },
  time: { width: 70, fontSize: 18, fontWeight: 'bold', color: '#fff' },
  place: { flex: 1, fontSize: 18, color: '#fff' },
  planImage: { width: windowWidth - 32, height: (windowWidth - 32) * 0.75, marginTop: 24, borderRadius: 12, alignSelf: 'center' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalSideArea: { flex: 1, width: '100%' },
  modalContent: { justifyContent: 'center', alignItems: 'center', width: windowWidth, height: windowHeight * 0.6 },
  modalImage: { width: windowWidth, height: windowHeight * 0.6 },
});