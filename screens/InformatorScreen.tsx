import React, { useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Text from '../components/MyText';

import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as WebBrowser from 'expo-web-browser';
import * as Sharing from 'expo-sharing';

// Wymuś bundlowanie PDF przez Metro
import PDF_FILE from '../data/Mszalik-2025.pdf';

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
};

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Informator'>;

export default function InformatorScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const navigation = useNavigation<NavProp>();

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

  const smallBagItems = [
    'różaniec',
    'peleryna przeciwdeszczowa',
    'czapka z daszkiem lub inne nakrycie głowy',
    'krem z filtrem',
    'mała/średnia butelka wody (do dolewania w podróży)',
    'batonik lub przekąska na pierwszy dzień',
    'kanapki na ten pierwszy dzień',
    'chusteczki, mogą być nawilżane',
    'mały płyn do dezynfekcji',
    'bluza/lekka kurtka (na siebie lub do plecaka)',
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
    'zestaw do przebijania bombelków (igły, octanisept)',
    'wapno, witaminy',
    'maści do nóg (np. lioton, olofen max)',
    'krem na otarcia (np. bepanthen)',
  ];

  const openPdf = async () => {
    try {
      // 1. Pobierz asset i uzyskaj jego URI
      const asset = Asset.fromModule(PDF_FILE);
      await asset.downloadAsync();
      const bundleUri = asset.localUri ?? asset.uri;

      // 2. Skopiuj do DocumentDirectory
      const destUri = FileSystem.documentDirectory + 'Mszalik-2025.pdf';
      await FileSystem.copyAsync({ from: bundleUri, to: destUri });

      if (Platform.OS === 'android') {
        // Android: użyj systemowego misownika
        const contentUri = await FileSystem.getContentUriAsync(destUri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1,
          type: 'application/pdf',
        });
      } else {
        // iOS: pokaż share-sheet, użytkownik wybierze „Zapisz w Plikach”
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(destUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Pobierz Mszalik 2025',
          });
        } else {
          // fallback: otwórz w przeglądarce
          await WebBrowser.openBrowserAsync(destUri);
        }
      }
    } catch (e: any) {
      console.error('Błąd przy otwieraniu PDF:', e);
      Alert.alert('Błąd', `Nie udało się otworzyć Mszalika: ${e.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.headerWrapper}>
          <Text style={styles.header}>Lista rzeczy do wzięcia na pielgrzymkę</Text>
        </View>

        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionHeader}>MAŁY BAGAŻ PODRĘCZNY – PLECAK:</Text>
        </View>
        {smallBagItems.map((item, i) => (
          <Text key={`small-${i}`} style={styles.bulletText}>• {item}</Text>
        ))}

        <View style={[styles.sectionWrapper, { marginTop: 16 }]}>
          <Text style={styles.sectionHeader}>DUŻY BAGAŻ/WALIZKA – JADĄCY NA AUCIE:</Text>
        </View>
        {largeBagItems.map((item, i) => (
          <Text key={`large-${i}`} style={styles.bulletText}>• {item}</Text>
        ))}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ImportantPhones')}>
            <Text style={styles.navButtonText}>Ważne telefony</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={openPdf}>
            <Text style={styles.navButtonText}>Mszalik 2025</Text>
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
  scrollContent: {},
  headerWrapper: {
    backgroundColor: '#01503d',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f2d94e',
    textAlign: 'center',
    width: '100%',
  },
  sectionWrapper: {
    backgroundColor: '#01503d',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
    width: '100%',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f2d94e',
    textAlign: 'center',
    width: '100%',
    lineHeight: 24,
    marginBottom: 4,
  },
  bulletText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginLeft: 22,
    marginRight: 22,
    marginBottom: 4,
  },
  note: {
    fontSize: 16,
    color: '#fff',
    marginTop: 16,
    fontStyle: 'italic',
    marginLeft: 22,
    marginRight: 22,
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