// screens/IntentionsReaderScreen.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/MyText';
import { supabase } from '../lib/supabase';

const DEFAULT_FONT_SIZE = 18;
const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 30;

type DbIntention = {
  id: string;
  content: string;
  created_at: string;
};

const colorThemes = [
  {
    name: 'Domyślny',
    background: '#0e8569',
    card: '#01503d',
    section: '#0b6f58',
    text: '#ffffff',
    mutedText: '#d8eee8',
    accent: '#f2d94e',
    border: 'rgba(242, 217, 78, 0.35)',
  },
  {
    name: 'Jasny',
    background: '#e9f7f2',
    card: '#ffffff',
    section: '#f5fffb',
    text: '#12362d',
    mutedText: '#42665c',
    accent: '#0e8569',
    border: 'rgba(14, 133, 105, 0.25)',
  },
  {
    name: 'Ciepły',
    background: '#3a2b19',
    card: '#5a3f22',
    section: '#6b4b29',
    text: '#fff8e8',
    mutedText: '#f5ddb5',
    accent: '#f2d94e',
    border: 'rgba(242, 217, 78, 0.35)',
  },
  {
    name: 'Kontrast',
    background: '#101010',
    card: '#1c1c1c',
    section: '#262626',
    text: '#ffffff',
    mutedText: '#dddddd',
    accent: '#f2d94e',
    border: 'rgba(255, 255, 255, 0.22)',
  },
];

function getTodayTitle() {
  const today = new Date();

  const formattedDate = today.toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return `Intencje na ${formattedDate}`;
}

function getTodayDateForDb() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}

function splitIntoFiveParts(intentions: DbIntention[]) {
  const parts: DbIntention[][] = [[], [], [], [], []];

  if (intentions.length === 0) {
    return parts;
  }

  const baseSize = Math.floor(intentions.length / 5);
  const extra = intentions.length % 5;

  let currentIndex = 0;

  for (let partIndex = 0; partIndex < 5; partIndex += 1) {
    const partSize = baseSize + (partIndex < extra ? 1 : 0);

    parts[partIndex] = intentions.slice(currentIndex, currentIndex + partSize);
    currentIndex += partSize;
  }

  return parts;
}

export default function IntentionsReaderScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [themeIndex, setThemeIndex] = useState(0);

  const [intentions, setIntentions] = useState<DbIntention[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const theme = colorThemes[themeIndex];

  const intentionParts = useMemo(() => {
    return splitIntoFiveParts(intentions);
  }, [intentions]);

  const loadIntentions = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const today = getTodayDateForDb();

      const { data, error } = await supabase
        .from('intentions')
        .select('id, content, created_at')
        .eq('intention_date', today)
        .order('created_at', { ascending: true });

      if (error) {
        console.log('Load intentions error:', error);
        setLoadError('Nie udało się pobrać intencji. Sprawdź połączenie z internetem i spróbuj ponownie.');
        setIntentions([]);
        return;
      }

      const cleanedIntentions = (data ?? [])
        .filter((item) => item.content && item.content.trim().length > 0)
        .map((item) => ({
          id: item.id,
          content: item.content.trim(),
          created_at: item.created_at,
        }));

      setIntentions(cleanedIntentions);
    } catch (error) {
      console.log('Load intentions exception:', error);
      setLoadError('Wystąpił problem podczas pobierania intencji.');
      setIntentions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: 'Czytanie intencji',
    });
  }, [navigation]);

  useEffect(() => {
    StatusBar.setBackgroundColor('#333333');
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(false);
  }, [isPortrait]);

  useEffect(() => {
    loadIntentions();
  }, [loadIntentions]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(false);

      loadIntentions();
    }, [loadIntentions])
  );

  const increaseFont = () => {
    setFontSize((prev) => Math.min(prev + 2, MAX_FONT_SIZE));
  };

  const decreaseFont = () => {
    setFontSize((prev) => Math.max(prev - 2, MIN_FONT_SIZE));
  };

  const changeTheme = () => {
    setThemeIndex((prev) => (prev + 1) % colorThemes.length);
  };

  const resetSettings = () => {
    setFontSize(DEFAULT_FONT_SIZE);
    setThemeIndex(0);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={[styles.toolbar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.toolButton, { backgroundColor: theme.section, borderColor: theme.border }]}
          onPress={decreaseFont}
        >
          <Text style={[styles.toolButtonText, { color: theme.accent }]}>A-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.toolButton, { backgroundColor: theme.section, borderColor: theme.border }]}
          onPress={increaseFont}
        >
          <Text style={[styles.toolButtonText, { color: theme.accent }]}>A+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.colorButton, { backgroundColor: theme.section, borderColor: theme.border }]}
          onPress={changeTheme}
        >
          <Text style={[styles.colorButtonText, { color: theme.accent }]}>Kolory</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.resetButton, { backgroundColor: theme.accent }]}
          onPress={resetSettings}
        >
          <Text style={[styles.resetButtonText, { color: theme.card }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={[styles.introCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.introTitle, { color: theme.accent }]}>
            {getTodayTitle()}
          </Text>

          <Text style={[styles.introText, { color: theme.mutedText }]}>
            Intencje są podzielone na 5 części. Każda część może zostać odczytana przed kolejną dziesiątką różańca.
          </Text>

          <Text style={[styles.themeInfo, { color: theme.mutedText }]}>
            Liczba intencji: {intentions.length} • Rozmiar tekstu: {fontSize} • Motyw: {theme.name}
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.refreshButton, { backgroundColor: theme.accent }]}
            onPress={loadIntentions}
            disabled={isLoading}
          >
            <Text style={[styles.refreshButtonText, { color: theme.card }]}>
              {isLoading ? 'Pobieranie...' : 'Odśwież intencje'}
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={[styles.stateCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ActivityIndicator size="large" color={theme.accent} />
            <Text style={[styles.stateText, { color: theme.mutedText }]}>
              Pobieranie intencji...
            </Text>
          </View>
        ) : loadError ? (
          <View style={[styles.stateCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.stateTitle, { color: theme.accent }]}>
              Błąd pobierania
            </Text>

            <Text style={[styles.stateText, { color: theme.mutedText }]}>
              {loadError}
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.retryButton, { backgroundColor: theme.accent }]}
              onPress={loadIntentions}
            >
              <Text style={[styles.retryButtonText, { color: theme.card }]}>
                Spróbuj ponownie
              </Text>
            </TouchableOpacity>
          </View>
        ) : intentions.length === 0 ? (
          <View style={[styles.stateCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.stateTitle, { color: theme.accent }]}>
              Brak intencji
            </Text>

            <Text style={[styles.stateText, { color: theme.mutedText }]}>
              Na dzisiaj nie ma jeszcze żadnych przesłanych intencji.
            </Text>
          </View>
        ) : (
          intentionParts.map((part, partIndex) => (
            <View
              key={`part-${partIndex}`}
              style={[
                styles.partCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <View style={[styles.partHeader, { borderBottomColor: theme.border }]}>
                <View style={[styles.partBadge, { backgroundColor: theme.accent }]}>
                  <Text style={[styles.partBadgeText, { color: theme.card }]}>
                    {partIndex + 1}
                  </Text>
                </View>

                <View style={styles.partHeaderTextBox}>
                  <Text style={[styles.partTitle, { color: theme.accent }]}>
                    Część {partIndex + 1}
                  </Text>

                  <Text style={[styles.partSubtitle, { color: theme.mutedText }]}>
                    Przed {partIndex + 1}. dziesiątką różańca
                  </Text>
                </View>
              </View>

              {part.length > 0 ? (
                part.map((intention, intentionIndex) => (
                  <View
                    key={intention.id}
                    style={[
                      styles.intentionBox,
                      {
                        backgroundColor: theme.section,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text style={[styles.intentionNumber, { color: theme.accent }]}>
                      Intencja {intentionIndex + 1}
                    </Text>

                    <Text
                      style={[
                        styles.intentionText,
                        {
                          color: theme.text,
                          fontSize,
                          lineHeight: Math.round(fontSize * 1.45),
                        },
                      ]}
                    >
                      {intention.content}
                    </Text>
                  </View>
                ))
              ) : (
                <View
                  style={[
                    styles.intentionBox,
                    {
                      backgroundColor: theme.section,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.intentionText,
                      {
                        color: theme.mutedText,
                        fontSize,
                        lineHeight: Math.round(fontSize * 1.45),
                        fontStyle: 'italic',
                      },
                    ]}
                  >
                    Brak intencji w tej części.
                  </Text>
                </View>
              )}

              <View style={[styles.stopBox, { borderTopColor: theme.border }]}>
                <Text style={[styles.stopText, { color: theme.accent }]}>
                  Koniec części {partIndex + 1}.
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    gap: 7,
  },

  toolButton: {
    width: 46,
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  toolButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  colorButton: {
    flex: 1,
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colorButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  resetButton: {
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resetButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  introCard: {
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
  },

  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },

  introText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  themeInfo: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 9,
  },

  refreshButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  refreshButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  stateCard: {
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
    alignItems: 'center',
  },

  stateTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },

  stateText: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },

  retryButton: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  retryButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  partCard: {
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
  },

  partHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderBottomWidth: 1,
  },

  partBadge: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  partBadgeText: {
    fontSize: 19,
    fontWeight: 'bold',
  },

  partHeaderTextBox: {
    flex: 1,
  },

  partTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  partSubtitle: {
    marginTop: 2,
    fontSize: 13,
  },

  intentionBox: {
    marginHorizontal: 12,
    marginTop: 12,
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
  },

  intentionNumber: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  intentionText: {
    fontWeight: '500',
  },

  stopBox: {
    marginTop: 13,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderTopWidth: 1,
  },

  stopText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});