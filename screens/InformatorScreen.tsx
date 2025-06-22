// screens/InfoScreen.tsx
import React, { useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Menu: undefined;
  Śpiewnik: undefined;
  SpiewnikDetail: { song: any };
  DailyPlan: undefined;
  DailyPlanDetail: { day: number };
  ImportantPhones: undefined;
  Informator: undefined;
  Autor: undefined;
  Zapisy: undefined;
  Info: undefined;
};

type InfoNavProp = NativeStackNavigationProp<RootStackParamList, 'Info'>;

export default function InfoScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const navigation = useNavigation<InfoNavProp>();

  // Ustawienia StatusBar
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

  // Dane listy (można też wyrzucić jeśli już nie potrzebne)
  const smallBagItems = [
    'różańiec',
    'peleryna przeciwdeszczowa',
    'czapka z daszkiem lub inne nakrycie głowy',
    'krem z filtrem',
    'mała/średnia butelka wody (do dolewania w podróży)',
    'batonik lub przekąska na pierwszy dzień',
    'kanapki na ten pierwszy dzień',
    'chusteczki, mogą być nawilżane',
    'mały płyn do dezynfekcji',
    'bluża/lekka kurtka (na siebie lub do plecaka)',
    'menażka / kubek / miseczka lub jednorazowe naczynia',
    'łyżka (najbardziej potrzebna), nóż, widelec (może plastikowe)',
    'kocyk/mata do odpoczynku w trasie',
    'długopis do zapisywania intencji na różaniec',
    'dowód osobisty',
    'okulary przeciwsłoneczne (opcjonalnie)',
    'kasa na drobne wydatki',
    'intencje swoje oraz bliskich',
  ];
  const largeBagItems = [
    'karimata',
    'śpiwór',
    'druga bluza/lekka kurtka',
    'co najmniej 2 pary butów (jedna na sobie, jedna w bagażu)',
    'koszulki: jedna na każdy dzień + zapasowe',
    'piżama',
    'klapki/laczki',
    'bielizna i dobre skarpety',
    'spodnie/spodenki/legginsy/spódnice do kolana',
    'kosmetyczka: szampon, żel pod prysznic, pasta, szczoteczka itp.',
    'suszarka (jeśli konieczna)',
    'ręcznik',
    'mała poduszka / jasiek (opcjonalnie)',
    'ładowarka do telefonu',
    'powerbank (opcjonalnie)',
    'leki przyjmowane na stałe, opatrunki',
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <Text style={styles.header}>Lista rzeczy do wzięcia na pielgrzymkę</Text>

        <Text style={styles.sectionHeader}>MAŁY BAGAŻ PODRĘCZNY - PLECAK:</Text>
        {smallBagItems.map((item, idx) => (
          <Text key={`small-${idx}`} style={styles.bulletText}>
            • {item}
          </Text>
        ))}

        <Text style={styles.sectionHeader}>DUŻY BAGAŻ/WALIZKA JADĄCY NA AUCIE:</Text>
        {largeBagItems.map((item, idx) => (
          <Text key={`large-${idx}`} style={styles.bulletText}>
            • {item}
          </Text>
        ))}

        <Text style={styles.note}>
          Pamiętaj, że można dokupić coś w mijanym sklepie, a także poratować się nawzajem wśród
          pielgrzymów. 😊
        </Text>

        {/* Dwa przyciski: Ważne telefony i Autor */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('ImportantPhones')}
          >
            <Text style={styles.navButtonText}>Ważne telefony</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Autor')}
          >
            <Text style={styles.navButtonText}>Podziękowania</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e8569',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f2d94e',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f2d94e',
    marginTop: 12,
    marginBottom: 8,
  },
  bulletText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginLeft: 8,
    marginBottom: 4,
  },
  note: {
    fontSize: 16,
    color: '#fff',
    marginTop: 16,
    fontStyle: 'italic',
  },
  buttonsContainer: {
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#f2d94e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
