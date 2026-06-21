// screens/AutorScreen.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/MyText';


const compliments = [
  "Masz w sobie coś takiego, że przy Tobie człowiekowi od razu robi się lżej.",
  "Dobrze, że jesteś w tej grupie — robisz klimat, którego nie da się podrobić.",
  "Masz uśmiech, który działa lepiej niż kawa na postoju.",
  "Z Tobą nawet dłuższy etap wydaje się trochę krótszy.",
  "Masz dobrą energię — taką, którą inni naprawdę czują.",
  "Potrafisz poprawić humor samą obecnością.",
  "Jesteś jedną z tych osób, przy których łatwiej się nie poddawać.",
  "Masz talent do robienia zwykłych chwil trochę lepszymi.",
  "Twoje poczucie humoru powinno być wpisane w plan dnia.",
  "Dzięki Tobie ta pielgrzymka ma więcej uśmiechu.",
  "Masz w sobie spokój, który udziela się innym.",
  "Jesteś dowodem na to, że dobre towarzystwo naprawdę dodaje sił.",
  "Z Tobą rozmowa sama się klei, nawet kiedy nogi już nie bardzo.",
  "Masz w sobie tyle życzliwości, że można by nią obdzielić pół grupy.",
  "Twój uśmiech powinien być oficjalnym punktem regeneracyjnym.",
  "Masz świetną umiejętność rozładowywania napięcia.",
  "Przy Tobie nawet zmęczenie wygląda trochę mniej groźnie.",
  "Jesteś osobą, której obecność po prostu dobrze robi.",
  "Masz naturalny dar dodawania ludziom otuchy.",
  "Z Tobą łatwiej iść dalej — dosłownie i w przenośni.",

  "Masz dobry vibe. Taki pielgrzymkowy, ale premium.",
  "Twoja energia jest jak dodatkowy baton w plecaku — ratuje sytuację.",
  "Masz uśmiech, który mógłby dostać własną pieczątkę w książeczce pielgrzyma.",
  "Gdyby dobra atmosfera była konkursem, byłbyś/byłabyś w finale.",
  "Z Tobą nawet asfalt ma trochę więcej sensu.",
  "Masz talent do mówienia czegoś dokładnie wtedy, kiedy ktoś tego potrzebuje.",
  "Twoje żarty powinny być puszczane przez megafon na trudniejszych odcinkach.",
  "Dobrze, że idziesz — grupa od razu ma lepszy skład.",
  "Masz w sobie coś, co sprawia, że ludzie chcą iść obok Ciebie.",
  "Twoja obecność to taki mały luksus na trasie.",
  "Gdyby życzliwość miała krokomierz, miałbyś/miałabyś rekord dnia.",
  "Masz serce większe niż plecak po pakowaniu na ostatnią chwilę.",
  "Twój humor ma lepszą trasę niż Google Maps.",
  "Jesteś jak cień w upalny dzień — bardzo potrzebny/potrzebna.",
  "Z Tobą nawet postój bez krzesła brzmi jak dobry pomysł.",
  "Masz styl bycia, który mówi: spokojnie, damy radę.",
  "Twój śmiech powinien być zapisany jako punkt programu.",
  "Masz taką energię, że nawet powerbank mógłby się od Ciebie ładować.",
  "Twoje dobre słowo potrafi zrobić komuś cały dzień.",
  "Jesteś chodzącym argumentem za tym, że warto być życzliwym.",

  "Masz w sobie dużo ciepła i widać to bardziej niż myślisz.",
  "Jesteś osobą, przy której inni mogą poczuć się swobodnie.",
  "Masz wyjątkową umiejętność zauważania ludzi.",
  "Twoja obecność jest cicha, ale bardzo ważna.",
  "Masz w sobie dobro, które nie potrzebuje reklamy.",
  "Potrafisz być wsparciem bez wielkich słów.",
  "Jesteś kimś, kto wnosi spokój tam, gdzie robi się nerwowo.",
  "Masz piękny sposób bycia — prosty, dobry i prawdziwy.",
  "Dzięki Tobie komuś dzisiaj mogło być łatwiej.",
  "Masz serce, które widać w małych gestach.",
  "Twoja życzliwość jest bardzo konkretna — i bardzo potrzebna.",
  "Jesteś osobą, którą dobrze mieć obok w drodze.",
  "Masz w sobie pogodę ducha, która naprawdę pomaga.",
  "Twoje dobre nastawienie jest zaraźliwe w najlepszym możliwym sensie.",
  "Potrafisz sprawić, że ktoś czuje się zauważony.",
  "Masz klasę w tym, jak traktujesz innych.",
  "Twoja obecność dodaje grupie czegoś bardzo dobrego.",
  "Jesteś przykładem, że proste dobro ma największą siłę.",
  "Masz w sobie pokój, który potrafi uspokoić innych.",
  "Twoje wsparcie może znaczyć dla kogoś więcej, niż myślisz.",

  "Masz krok pielgrzyma i serce człowieka, z którym chce się iść.",
  "Twój śpiew dodaje odwagi nawet tym, którzy śpiewają tylko w myślach.",
  "Masz w sobie wytrwałość, która inspiruje.",
  "Twoja modlitwa i obecność są dla grupy prawdziwym wsparciem.",
  "Idziesz tak, że człowiek przypomina sobie, po co jest w drodze.",
  "Masz w sobie siłę, która nie musi być głośna, żeby była widoczna.",
  "Twoja wiara ma w sobie dużo spokoju i autentyczności.",
  "Potrafisz nieść dobrą atmosferę nawet wtedy, gdy nogi już protestują.",
  "Masz w sobie coś z latarni — nie krzyczysz, ale pokazujesz kierunek.",
  "Twoja obecność na trasie jest jak dobry znak.",
  "Jesteś jednym z powodów, dla których ta droga zostanie dobrze zapamiętana.",
  "Masz dar dodawania ludziom sił, nawet gdy sam/sama jesteś zmęczony/zmęczona.",
  "Twoja cierpliwość na trasie robi wrażenie.",
  "Z Tobą łatwiej uwierzyć, że każdy kilometr ma sens.",
  "Masz w sobie pokorę i radość — bardzo dobre połączenie.",
  "Twój sposób przeżywania tej drogi może być dla kogoś inspiracją.",
  "Potrafisz iść z sercem, nie tylko z nogami.",
  "Twoje dobre słowo na trasie może zostać z kimś na długo.",
  "Masz w sobie ducha pielgrzyma — i to widać.",
  "Dzięki Tobie ta droga jest bardziej wspólna.",

  "Autor aplikacji podobno przyjmuje komplementy w każdej ilości.",
  "Jeśli widzisz autora aplikacji, powiedz mu, że zrobił kawał dobrej roboty.",
  "Ta aplikacja sama się nie napisała — autor zasłużył na dobre słowo.",
  "Powiedz autorowi, że aplikacja działa tak dobrze, że aż podejrzanie.",
  "Autor aplikacji zasługuje dziś na komplement, kawę i spokojny build bez błędów.",
  "Jeśli autor jest obok, to właśnie znalazł się dobry moment, żeby go pochwalić.",
  "Powiedz autorowi, że jego trud nie poszedł na marne — serio.",
  "Ta aplikacja ma sens, bo ktoś poświęcił jej czas. Warto mu to powiedzieć.",
  "Autorze, jeśli to czytasz: dobra robota. Możesz się uśmiechnąć.",
  "Komplement dla autora: zrobiłeś coś, co naprawdę się przydaje.",

  "Masz dziś za zadanie powiedzieć komuś coś miłego. To jest oficjalne polecenie aplikacji.",
  "Rozejrzyj się. Ktoś obok właśnie czeka na dobre słowo, nawet jeśli o tym nie wie.",
  "Ten komplement działa najlepiej, gdy zostanie wypowiedziany na głos.",
  "Powiedz to komuś obok: dobrze, że jesteś.",
  "Zrób komuś dzień i powiedz mu coś dobrego bez żadnego powodu.",
  "Najbliższa osoba obok właśnie wygrała darmowy komplement.",
  "Nie chowaj tego tekstu dla siebie — podaj go dalej.",
  "Uśmiech drugiej osoby za 3… 2… 1… teraz powiedz komplement.",
  "Ten ekran nie został stworzony do czytania w ciszy. Powiedz to komuś.",
  "Komplement niewypowiedziany traci 80% mocy. Użyj go od razu."
];

export default function AutorScreen() {
  const [compliment, setCompliment] = useState<string>('');
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;
  const translateAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    StatusBar.setBackgroundColor('#333333');
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(false);
  }, []);

  const handleGenerate = useCallback(() => {
    const index = Math.floor(Math.random() * compliments.length);

    fadeAnim.setValue(0);
    scaleAnim.setValue(0.94);
    translateAnim.setValue(12);

    setCompliment(compliments[index]);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, translateAnim]);

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#333333" barStyle="light-content" />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={styles.headerBox}>
          <Text style={styles.title}>Generator komplementów</Text>

          <Text style={styles.intro}>
            Wygeneruj komplement aby umilić sobie dzień, albo powiedz go komuś, kto tego potrzebuje. {'\n'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGenerate}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Wygeneruj komplement</Text>
        </TouchableOpacity>

        {compliment !== '' && (
          <Animated.View
            style={[
              styles.complimentBox,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: translateAnim },
                ],
              },
            ]}
          >
            <Text style={styles.complimentLabel}>Twój komplement:</Text>
            <Text style={styles.complimentText}>{compliment}</Text>
          </Animated.View>
        )}

        {compliment === '' && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              Kliknij przycisk i spraw, żeby ktoś się uśmiechnął.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0e8569',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },

  headerBox: {
    backgroundColor: '#01503d',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f2d94e',
    textAlign: 'center',
    marginBottom: 12,
  },
  intro: {
    fontSize: 17,
    lineHeight: 24,
    color: '#fff',
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#f2d94e',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#01503d',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  complimentBox: {
    backgroundColor: '#01503d',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(242, 217, 78, 0.35)',
  },
  complimentLabel: {
    fontSize: 14,
    color: '#d8eee8',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  complimentText: {
    fontSize: 19,
    lineHeight: 27,
    color: '#f2d94e',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  emptyBox: {
    backgroundColor: 'rgba(1, 80, 61, 0.65)',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  emptyText: {
    color: '#d8eee8',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});