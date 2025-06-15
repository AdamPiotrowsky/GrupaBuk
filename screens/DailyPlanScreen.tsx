// screens/DailyPlanScreen.tsx
import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Menu: undefined;
  Śpiewnik: undefined;
  DailyPlan: undefined;           // <— ten sam klucz
  DailyPlanDetail: { day: number };
  ImportantPhones: undefined;
  Informator: undefined;
  Zapisy: undefined;
};

type DailyPlanNavProp = NativeStackNavigationProp<RootStackParamList, 'DailyPlan'>;

const days = Array.from({ length: 11 }, (_, i) => i + 1);

export default function DailyPlanScreen() {
  const navigation = useNavigation<DailyPlanNavProp>();

  return (
    <View style={styles.container}>
      <FlatList
        data={days}
        keyExtractor={item => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('DailyPlanDetail', { day: item })}
          >
            <Text style={styles.text}>Day {item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: {
    padding: 16,
    marginVertical: 4,
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
  },
  text: { fontSize: 18 },
});
