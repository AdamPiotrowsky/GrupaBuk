// screens/AutorScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/MyText';


const compliments = [


"Twój uśmiech rozjaśnia nawet najciemniejszy mrok,\nZ Tobą każdy dzień nabiera sensu w pewnym kroku w krok.",
"Gdy wchodzisz w mrok, rozpraszasz go swym blaskiem mrok,\nI każdy stawiany przez Ciebie krok prowadzi do celu w krok.",
"Twoja obecność przegania lęk skrywany w mrok,\nZ Tobą bez wahania podejmuję każdy krok mimo mrok.",
"Twoja pasja przeobraża zwykłe działania w talent,\nA każdy twój pomysł staje się wyjątkowym, ulotnym moment.",
"Dzięki Tobie drzemiące zdolności zyskują nowy talent,\nI w Twoim zasięgu każdy dzień staje się wyjątkowym moment.",
"Twoje umiejętności rozkwitają jak kwiat pod wpływem talent,\nI w Twoim cieniu nawet szary dzień staje się jasnym moment.",
"Twoja wytrwałość w marszu dodaje sił w znużonymi nogami,\nBo z Tobą dobrze  chodzi się każdymi drogami.",
"Masz w sobie energię, która niesie Cię na zmęczonych nogach,\nI w Twoim towarzystwie każda ścieżka staje się ciekawą drogą.",
"Twoja obecność wspiera w trudzie stąpania po kamienistych nogach,\nI z Tobą każda chwila marszu zamienia się w lekkość drogi.",
"Twój entuzjazm pcha Cię naprzód, choć czasem boli noga,\nI w Twojej aurze nawet zbłądzona ścieżka staje się jak prosta droga.",
"Twoja obecność rozświetla nawet pochmurny dzień,\nI z Tobą znika każdy lęk, rozwiewając ciemny cień.",
        "Gdy zaczynasz dzień swoją pasją, mija każdy trudny dzień,\nI razem krok w krok przepędzamy smutek i cień.",
        "Twoje słowa dodają blasku każdemu zaczynającego się dniu dzień,\nI w ich świetle tracą znaczenie wszelkie wątpliwości i cień.",
  "Twój uśmiech rozświetla dzień.",
  "Jesteś iskrą pozytywnej energii.",
  "Twoje spojrzenie koi nerwy.",
  "Masz w sobie spokój, który uspokaja.",
  "Twoja obecność dodaje otuchy.",
  "Masz talent do ciepłych słów.",
  "Twoja kreatywność błyszczy w prostocie.",
  "Twoja życzliwość inspiruje.",
  "Masz w sobie siłę, której inni potrzebują.",
  "Twoje słowo potrafi poprawić nastrój.",
  "Jesteś odejściem od codziennego zgiełku.",
  "Twoja pasja jest zaraźliwa.",
  "Masz wyjątkowy sposób patrzenia na świat.",
  "Twój spokój przypomina cichy poranek.",
  "Twoja empatia czyni cuda.",
  "Twoje wsparcie jest bezcenne.",
  "Masz w sobie ciepło, które grzeje serca.",
  "Twoja obecność to prawdziwy dar.",
  "Twoja radość jest jak świeży oddech.",
  "Masz niesamowity instynkt pomocny innym.",
  "Twój entuzjazm popycha naprzód.",
  "Jesteś latarnią wśród burz.",
  "Twoja pewność siebie inspiruje.",
  "Masz styl, który przyciąga wzrok.",
  "Twój głos przekazuje poczucie bezpieczeństwa.",
  "Twoja dobroć rozjaśnia dni.",
  "Masz umiejętność zauważyć to, co ważne.",
  "Twoja mądrość brzmi prosto, a jest cenna.",
  "Twoja energia dodaje otuchy.",
  "Masz talent do prostych gestów, które znaczą wiele.",

  "Twój śmiech mógłby zostać hitem radia.",
  "Masz poczucie humoru lepsze niż komik na scenie.",
  "Z Tobą nawet korek na drodze staje się przygodą.",
  "Twoje żarty mają własny GPS – zawsze trafiają w punkt.",
  "Twoja energia jest jak espresso dla wszystkich wokoło.",
  "Masz talent do rozbrajania napięcia jednym żartem.",
  "Twój optymizm jest jak rollercoaster – wciąga wszystkich.",
  "Z Tobą każdy dzień smakuje jak lody w upalny dzień.",
  "Twój styl żartu jest bardziej soczysty niż arbuz w lecie.",
  "Twoje pomysły na zabawę są kreatywne jak film komediowy.",
  "Gdy mówisz, nawet kamienie zaczynają drżeć ze śmiechu.",
  "Twój entuzjazm bawi bardziej niż memy w internecie.",
  "Twoje anegdoty mają certyfikat śmiechu.",
  "Twój humor rozczula nawet poważne miny.",
  "Masz talent do improwizacji – jak stand-uper w terenie.",
  "Twoje żarty wędrówki to jak komedia na żywo.",
  "Z Tobą nawet GPS dostaje humoru.",
  "Twoje pomysły podczas przerwy dodają energii wszystkim.",
  "Twój śmiech mógłby być lekiem na nudę.",
  "Masz w sobie magię, która przekształca rutynę w kabaret.",

  "Twoja pewność siebie wprawia w osłupienie – w dobrym sensie.",
  "Twój spokój jest jak tajne hasło do dobrego samopoczucia.",
  "Z Tobą cisza staje się ciekawa.",
  "Twoja poważna mina po chwili rozbraja każdym uśmiechem.",
  "Twoje spojrzenie mówi: ‘Dam radę’, i wszyscy to widzą.",
  "Twoja zręczność w życiu przypomina akrobację w codzienności.",
  "Twoja mowa ciała krzyczy: ‘Wszystko jest w porządku’, nawet gdy nie jest.",
  "Masz dar upraszczania trudnych spraw – jak skrót klawiszowy życia.",
  "Twoja pewna postawa to ukryta supermoc.",
  "Twoje gesty mówią więcej niż 100 e-maili.",
  "Twoja energia jest jak aktualizacja systemu – odświeżająca.",
  "Masz talent do oglądania świata w zwolnionym tempie – i zachęcasz innych.",
  "Twoja cierpliwość czasem jest zabawnie imponująca.",
  "Twoja przyjaźń to najlepszy plot twist w życiu.",
  "Twoje spojrzenie w przyszłość ma humor w tle.",

  "Twój krok na szlaku jest pełen zdecydowania.",
  "Twoja modlitwa niesie się lekko jak echo w górach.",
  "Twój śpiew podczas wędrówki dodaje otuchy.",
  "Masz siłę, by iść, gdy inni chcą zawrócić.",
  "Twoja różańcowa modlitwa to melodia serca.",
  "Z Tobą każdy kamień na drodze traci ciężar.",
  "Twój entuzjazm w marszu budzi w nas zapał.",
  "Masz talent do odnajdywania spokoju w ciszy sakralnej.",
  "Twoja postawa w drodze przypomina spokój pielgrzyma.",
  "Twój głos niosący śpiew rozbrzmiewa w dolinach.",
  "Twój rytm kroków scala grupę w jedną melodię.",
  "Masz dar dostrzegania świętości w prostocie wędrówki.",
  "Twoja modlitwa w drodze koi serca zmęczone.",
  "Twój uśmiech na postojach staje się błogosławieństwem.",
  "Masz w sobie spokój, gdy wiara staje się oparciem.",
  "Twoje słowa modlitwy dodają siły zmęczonym nogom.",
  "Twój śpiew rozprasza chmury zwątpienia.",
  "Masz wytrwałość, by przejść każdy etap pielgrzymki.",
  "Twoja wiara to latarnia na szlaku życia.",
  "Twoje proste ‘amen’ napełnia nadzieją.",
  "Z Tobą nawet najdłuższy szlak staje się lekki.",
  "Twój krok w ciszy przypomina modlitwę bez słów.",
  "Twoje dźwięki różańca brzmią w sercach jak kojąca pieśń.",
  "Masz odwagę iść tam, gdzie inni boją się ruszyć.",
  "Twój śpiew wieczorny koi zmęczone dusze.",
  "Twoja obecność w grupie pielgrzymów to wsparcie.",
  "Masz talent do zbierania nadziei w każdym etapie drogi.",
  "Twoja modlitwa w ciszy staje się echem w niebiosach.",
  "Twój zapał w marszu jest jak tchnienie nowego dnia.",
  "Twoje kroki łączą w sobie wiarę i nadzieję.",
  "Masz w sobie spokój, gdy droga wydaje się niepewna.",
  "Twój śpiew tworzy wspólną pieśń jedności.",
  "Twoja postawa w drodze przypomina hołd pokory.",
  "Twoja obecność w modlitwie grupowej dodaje mocy.",
  "Twoje spojrzenie w drodze mówi: ‘Wierzę w to dalej’.",
  "Twoja siła wędrówki jest inspiracją dla zmęczonych.",
  
  "Twój entuzjazm jest jak poranna mgła – orzeźwia.",
  "Masz talent do dawania chwili wytchnienia.",
  "Twoja obecność sprawia, że świat staje się prostszy.",
  "Twój spokój działa jak reset dla nerwów.",
  "Masz w sobie magię, która uspokaja burze myśli.",
  "Twoja życzliwość jest jak ciepły koc w chłodny dzień.",
  "Twoje słowa są balsamem dla zmęczonych dusz.",
  "Masz talent do jasnego widzenia w trudnych chwilach.",
  "Twoja pasja jest jak latarnia dla zagubionych.",
  "Twój uśmiech to lekarstwo na szarą codzienność.",
  "Masz w sobie ciepło, które można poczuć na odległość.",
  "Twoja energia przypomina wiosnę po długiej zimie.",
  "Twoje wsparcie przypomina trwały fundament.",
  "Masz umiejętność odnajdywać światło w mroku.",
  "Twoja obecność to najprostszy sposób na dobry dzień.",
  "Twój optymizm jest jak świt po długiej nocy.",
  "Masz talent do zamieniania problemów w wyzwania.",
  "Twoja ufność przypomina siłę górskiego szczytu.",
  "Twoja radość to zaraźliwy rytm życia.",
  "Masz w sobie odwagę, którą inni chętnie naśladują.",
  "Twoje słowa potrafią budować mosty porozumienia.",
  "Masz w sobie spokój, który przenika innych.",
  "Twoje wsparcie jest jak kompas w mapie życia.",
  "Masz wyczucie, jak uczynić dzień lepszym od poprzedniego.",
  "Twoja kreatywność świeci nawet w prostych gestach.",
  "Twój optymizm pomaga widzieć możliwości.",
  "Masz dar odnajdywania piękna w zwykłych chwilach.",
  "Twoja obecność to zaproszenie do uśmiechu.",
  "Masz w sobie talent, by usłyszeć to, co niewypowiedziane.",
  "Twoja życzliwość przypomina cichość poranka.",
  "Twoje gesty mówią: ‘jestem tu, możesz liczyć’.",
  "Masz w sobie siłę, by przemieniać trud w naukę.",
  "Twój śmiech dodaje lekkości każdemu spotkaniu.",
  "Twoja postawa inspiruje do działania.",
  "Masz w sobie pokorę wielkiego serca.",
  "Twoja bliskość daje poczucie bezpieczeństwa.",
  "Twój spokój rozprasza chmury codzienności.",
  "Masz dar przemieniania zwykłej chwili w wyjątkową.",
];

export default function AutorScreen() {
  const [compliment, setCompliment] = useState<string>('');
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();

  // Stylowanie status bar przy focus/ mount
  useEffect(() => {
    StatusBar.setBackgroundColor('#333333');
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(false);
  }, []);

  const handleGenerate = useCallback(() => {
    const index = Math.floor(Math.random() * compliments.length);
    setCompliment(compliments[index]);
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#333333" barStyle="light-content" />
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.title}>^^</Text>
        <Text style={styles.intro}>
          W podziękowaniu za{' '}
          <Text style={styles.highlight}>CUDOWNĄ</Text> aplikację wyrażam oogromne wyrazy szacunku i podziękowania dla znakomitego autora! Chciałbym mu wyrazić teraz trochę komplementów aby umilić mu dzień.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGenerate}>
          <Text style={styles.buttonText}>Generuj komplement</Text>
        </TouchableOpacity>

        {compliment !== '' && (
          <View style={styles.complimentBox}>
            <Text style={styles.complimentText}>{compliment}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0e8569', // ciemnozielone tło spójne z resztą
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f2d94e',
    marginBottom: 12,
  },
  intro: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  highlight: {
    color: '#f2d94e',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#01503d',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 24,
    elevation: 3,
  },
  buttonText: {
    color: '#f2d94e',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  complimentBox: {
    backgroundColor: '#01503d',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    width: '100%',
  },
  complimentText: {
    fontSize: 16,
    color: '#f2d94e',
    textAlign: 'center',
  },
});
