// screens/DailyPlanDetailScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, Dimensions, Modal,
  TouchableOpacity, StatusBar,
} from 'react-native';
import dailyPlans from './data/dailyplan.json';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

type Plan = {
  day: number; date: string; weekday: string; intention: string;
  start: { location: string; time: string };
  finish: { location: string; time: string };
  mass: { location: string; time: string };
  meal: { location: string; time: string };
  image: string;
};

const { width: W, height: H } = Dimensions.get('window');

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

const labelMap = { start: 'Start', finish: 'Meta', mass: 'Msza', meal: 'Posiłek' } as const;

export default function DailyPlanDetailScreen({ route }: any) {
  const insets  = useSafeAreaInsets();
  const { day } = route.params;
  const plan    = (dailyPlans as Plan[]).find(p => p.day === day);
  const [open, setOpen] = useState(false);

  /* -------- pinch shared value -------- */
  const scale = useSharedValue(1);

  const pinch = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    { start: number }
  >({
    onStart: (_, ctx) => {
      ctx.start = scale.value;
      runOnJS(console.log)('pinch start');          // log w Metro
    },
    onActive: (e, ctx) => {
      let s = ctx.start * e.scale;
      if (s < 1) s = 1;
      if (s > 3) s = 3;
      scale.value = s;
    },
  });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  /* reset po zamknięciu */
  useEffect(() => {
    if (!open) scale.value = withTiming(1, { duration: 100 });
  }, [open]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');
    }, [])
  );

  if (!plan) return <View style={styles.center}><Text style={{color:'#fff'}}>Brak danych</Text></View>;
  const imgSrc = planImages[plan.image];

  /* ---------- render ---------- */
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.wrapper, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.h1}>{plan.date} – {plan.weekday}</Text>
        <Text style={styles.h2}>{plan.intention}</Text>
        {(Object.keys(labelMap) as (keyof typeof labelMap)[]).map(k => (
          <View key={k} style={styles.row}>
            <Text style={styles.label}>{labelMap[k]}</Text>
            <Text style={styles.time}>{plan[k].time}</Text>
            <Text style={styles.place}>{plan[k].location}</Text>
          </View>
        ))}
        {!!imgSrc && (
          <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.9}>
            <Image source={imgSrc} style={styles.thumb} />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* ------------ MODAL ------------ */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalBg}>
          {/* obszar nad zdjęciem */}
          <TouchableOpacity style={styles.side} onPress={() => setOpen(false)} />
          {/* zdjęcie z pinch */}
          <PinchGestureHandler onGestureEvent={pinch}>
            <Animated.Image
              source={imgSrc}
              style={[styles.fullImg, animStyle]}
              resizeMode="contain"
            />
          </PinchGestureHandler>
          {/* obszar pod zdjęciem */}
          <TouchableOpacity style={styles.side} onPress={() => setOpen(false)} />
        </View>
      </Modal>
    </View>
  );
}

/* ------------- STYLE ------------- */
const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: '#0e8569' },
  wrapper: { padding: 16 },
  center:  { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#556B2F' },

  h1: { fontSize: 24, fontWeight: 'bold', color: '#f2d94e', textAlign: 'center', marginBottom: 8 },
  h2: { fontSize: 20, color: '#f2d94e', textAlign: 'center', marginBottom: 16, fontWeight: 'bold' },

  row:   { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  label: { width: 80, fontSize: 18, fontWeight: '600', color: '#fff' },
  time:  { width: 70, fontSize: 18, fontWeight: 'bold',  color: '#fff' },
  place: { flex: 1, fontSize: 18, color: '#fff' },

  thumb:   { width: W - 32, height: (W - 32) * 0.75, marginTop: 24, borderRadius: 12, alignSelf: 'center' },

  modalBg: { flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.9)' },
  side:    { flex: 1 },          // kliknięcie zamyka modal
  fullImg: { width: W * 0.9, height: H * 0.7, alignSelf: 'center' },
});
