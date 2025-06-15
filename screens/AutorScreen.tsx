// screens/AutorScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';

const compliments = [
 'Twój uśmiech rozświetla każdy pokój.',
  'Masz talent, który inspiruje innych.',
  'Twoja kreatywność nie zna granic.',
  'Potrafisz dostrzec piękno w codziennych chwilach.',
  'Twoje poczucie humoru uszczęśliwia wszystkich wokół.',
  'Jesteś jak promień słońca w pochmurny dzień.',
  'Twoja pasja zaraża wszystkich dookoła.',
  'Masz w sobie spokój, który koi serca.',
  'Twoje pomysły są zawsze świeże i zaskakujące.',
  'Twój głos brzmi jak najpiękniejsza melodia.',
  'Twoja empatia sprawia, że ludzie czują się ważni.',
  'Masz wspaniały gust i niepowtarzalny styl.',
  'Twoja determinacja budzi podziw.',
  'Umiesz słuchać lepiej niż ktokolwiek inny.',
  'Jesteś mistrzem rozmowy i zabawnego komentarza.',
  'Twoja obecność to najlepszy prezent dla towarzystwa.',
  'Twoje oczy opowiadają historie pełne ciepła.',
  'Twój śmiech to najlepsza muzyka dla duszy.',
  'Twoje pomysły potrafią zmienić świat na lepsze.',
  'Twoja energia jest zaraźliwa i pełna życia.',
  'Masz w sobie nieodkryte pokłady talentu.',
  'Twoja dobroć nie zna granic.',
  'Umiesz rozjaśnić czyjś dzień jednym ciepłym słowem.',
  'Masz serce przepełnione pasją.',
  'Jesteś niewyczerpanym źródłem inspiracji.',
  'Twój entuzjazm jest naprawdę zaraźliwy.',
  'Jesteś wyjątkowy w każdym calu.',
  'Twoja odwaga motywuje innych do działania.',
  'Jesteś niczym wiosenny powiew świeżości.',
  'Twoja charyzma przyciąga ludzi jak magnes.',
  'Masz w sobie moc tworzenia małych cudów.',
  'Twoja mądrość przewyższa wiele lat doświadczenia.',
  'Potrafisz znaleźć rozwiązanie w każdej trudnej sytuacji.',
  'Twoje słowa pozostają w pamięci na długo.',
  'Jesteś jak kameleon – doskonale dopasowujesz się do każdej roli.',
  'Twoja wrażliwość porusza serca innych.',
  'Masz duszę artysty pełną wyobraźni.',
  'Twoja pasja jest inspirująca i niepowstrzymana.',
  'Umiesz dostrzec piękno tam, gdzie inni go nie widzą.',
  'Jesteś jak jasna gwiazda oświetlająca drogę.',
  'Twoja życzliwość zmienia świat na lepsze.',
  'Masz wewnętrzny kompas wskazujący zawsze właściwy kierunek.',
  'Twoje słowa potrafią uleczyć zranione serce.',
  'Jesteś mistrzem tworzenia wspaniałych wspomnień.',
  'Twoje pomysły to małe eksplozje radości.',
  'Twoja obecność dokłada wartości każdemu miejscu.',
  'Jesteś strażnikiem dobrego humoru i energii.',
  'Twoja wizja jest porywająca i inspirująca.',
  'Twoja pasja płonie jak nigdy gasnący ogień.',
  'Jesteś kapitanem pozytywnych zmian.'
];

export default function AutorScreen() {
  const [compliment, setCompliment] = useState<string>('');

  const handleGenerate = () => {
    const index = Math.floor(Math.random() * compliments.length);
    setCompliment(compliments[index]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Autor Aplikacji</Text>
      <Text style={styles.intro}>
        W podziękowaniu za <Text style={styles.highlight}>CUDOWNĄ</Text> aplikację wyrażam wyrazy szacunku dla autora!
      </Text>

      <View style={styles.buttonWrapper}>
        <Button title="Generuj komplement" onPress={handleGenerate} />
      </View>

      {compliment !== '' && (
        <View style={styles.complimentBox}>
          <Text style={styles.complimentText}>{compliment}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  intro: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  highlight: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  buttonWrapper: {
    width: '60%',
    marginBottom: 24,
  },
  complimentBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  complimentText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
