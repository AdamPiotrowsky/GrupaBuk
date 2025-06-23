// screens/DailyPlanDetailScreen.tsx
import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Linking,
  Platform,
  Modal,
} from 'react-native';
import dailyPlans from '../data/dailyplan.json'; // upewnij się, że ścieżka jest poprawna
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  distance?: string | number; // np. 40 lub "40 km"
  route?: string;             // URL do trasy
};

// Rozmiary ekranu
const { width: W, height: H } = Dimensions.get('window');

// Mapowanie etykiet
const labelMap = { start: 'Start', finish: 'Meta', mass: 'Msza', meal: 'Posiłek' } as const;

// Mapowanie obrazków
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
  // ... jeżeli więcej dni, dodaj kolejne
};

export default function DailyPlanDetailScreen({ route }: any) {
  const insets = useSafeAreaInsets();
  const { day } = route.params as { day: number };
  const plan = (dailyPlans as Plan[]).find(p => p.day === day);

  // Stan modal pełnoekranowego wyświetlenia obrazka
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // StatusBar
  useEffect(() => {
    StatusBar.setBackgroundColor('#333333');
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(false);
    }, [])
  );

  if (!plan) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Brak danych dla dnia {day}</Text>
      </View>
    );
  }

  // Źródło obrazka
  const imageSource = planImages[plan.image];

  // Przygotowanie tekstu dystansu:
  let distanceText: string | undefined = undefined;
  if (plan.distance !== undefined) {
    if (typeof plan.distance === 'number') {
      distanceText = `${plan.distance} km`;
    } else if (typeof plan.distance === 'string') {
      distanceText = plan.distance;
    }
  }

  // Handler otwarcia linku
  const openRouteLink = () => {
    if (plan.route) {
      Linking.openURL(plan.route).catch(err => console.error('Błąd otwarcia linku:', err));
    }
  };

  // Wysokość headera: 10% ekranu + SafeArea top
  const headerHeight = H * 0.12;

  return (
    <View style={styles.screen}>
      {/* Nagłówek: data i intencja, pełna szerokość, ok. 10% wysokości ekranu + SafeArea */}
      <View style={[
        styles.headerContainer,
        { height: headerHeight + insets.top, paddingTop: insets.top },
      ]}>
        <Text style={styles.h1}>{plan.date} – {plan.weekday}</Text>
        <Text style={styles.h2}>{plan.intention}</Text>
      </View>

      {/* ScrollView z pozostałą zawartością */}
      <ScrollView contentContainerStyle={[styles.wrapper, { paddingBottom: insets.bottom + 16 }]}>
        {/* Sekcja informacji: Start, Meta, Msza, Posiłek */}
        {(Object.keys(labelMap) as (keyof typeof labelMap)[]).map(key => {
          const item = plan[key];
          return (
            <View key={key} style={styles.row}>
              <Text style={styles.label}>{labelMap[key]}</Text>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.place}>{item.location}</Text>
            </View>
          );
        })}

        {/* Wiersz Trasa + dystans */}
        {(plan.route || distanceText) && (
          <View style={styles.row}>
            <Text style={styles.label}>Trasa</Text>
            <Text style={styles.time}>{distanceText ?? ''}</Text>
            {/* Można dodać inline button, ale mamy przycisk poniżej */}
          </View>
        )}

        {/* Obrazek planu: po kliknięciu otwiera modal z pełnym widokiem */}
        {!!imageSource && (
          <TouchableOpacity
            onPress={() => setImageModalVisible(true)}
            activeOpacity={0.8}
          >
            <Image
              source={imageSource}
              style={styles.thumb}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {/* Pod obrazkiem: przycisk „Link do trasy” z ikoną */}
        {plan.route && (
          <View style={styles.linkButtonContainer}>
            <TouchableOpacity style={styles.routeButton} onPress={openRouteLink}>
              <Text style={styles.routeButtonText}>Link do trasy</Text>
              <Image
                source={require('../assets/icons/out2.png')}
                style={styles.routeButtonIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal wyświetlający obraz na pełnym ekranie */}
      {imageSource && (
        <Modal
          visible={imageModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setImageModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setImageModalVisible(false)}
          >
            <Image
              source={imageSource}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0e8569' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#556B2F' },
  errorText: { color: '#fff', fontSize: 18 },

  // Header: data + intencja
  headerContainer: {
    width: '100%',
    backgroundColor: '#01503d', // ciemne tło
    justifyContent: 'center',
    alignItems: 'center',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f2d94e',
    textAlign: 'center',
    marginBottom: 2,
  },
  h2: {
    fontSize: 16,
    color: '#f2d94e',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  wrapper: {
    padding: 16,
  },
  row: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  label: { width: 80, fontSize: 18, fontWeight: '600', color: '#f2d94e' },
  time: { width: 70, fontSize: 18, fontWeight: 'bold', color: '#fff' },
  place: { flex: 1, fontSize: 18, color: '#fff' },

  thumb: {
    width: W - 32,
    height: (W - 32) * 0.75,
    marginTop: 6,
    borderRadius: 12,
    alignSelf: 'center',
    backgroundColor: '#333',
  },

  linkButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  routeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2d94e',
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  routeButtonText: {
    color: '#01503d',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  routeButtonIcon: {
    width: 22,
    height: 22,
  },

  // Modal pełnoekranowego obrazu:
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: W,
    height: H,
    // resizeMode "contain" powoduje, że cały obraz jest pokazany w całości,
    // z zachowaniem proporcji, na tle czarno półprzezroczystym.
  },
});
