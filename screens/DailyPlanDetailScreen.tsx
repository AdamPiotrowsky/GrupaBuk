// screens/DailyPlanDetailScreen.tsx
import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Linking,
  Platform,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import dailyPlans from '../data/dailyplan.json';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/MyText';

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
  distance?: string | number;
  route?: string;
};

const { width: W } = Dimensions.get('window');

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

const rows = [
  { key: 'start', label: 'Start' },
  { key: 'finish', label: 'Meta' },
  { key: 'mass', label: 'Msza' },
  { key: 'meal', label: 'Obiad' },
] as const;

export default function DailyPlanDetailScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { day } = route.params as { day: number };
  const plan = (dailyPlans as Plan[]).find(p => p.day === day);

  const [imageModalVisible, setImageModalVisible] = useState(false);

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

  useEffect(() => {
    if (plan) {
      navigation.setOptions({
        title: `${plan.date.trim()} - ${plan.weekday}`,
      });
    }
  }, [navigation, plan]);

  if (!plan) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Brak danych dla dnia {day}</Text>
      </View>
    );
  }

  const imageSource = planImages[plan.image];

  const imageViewerImages = imageSource
    ? [{ uri: Image.resolveAssetSource(imageSource).uri }]
    : [];

  let distanceText: string | undefined;

  if (plan.distance !== undefined) {
    distanceText =
      typeof plan.distance === 'number'
        ? `${plan.distance}\u00A0km`
        : plan.distance;
  }

  const openRouteLink = () => {
    if (plan.route) {
      Linking.openURL(plan.route).catch(err =>
        console.error('Błąd otwarcia linku:', err)
      );
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.wrapper,
          { paddingBottom: insets.bottom + 18 },
        ]}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.intentionTitle}>Intencja dnia</Text>
          <Text style={styles.intentionText}>{plan.intention}</Text>
        </View>

        <View style={styles.infoBox}>
          {rows.map((row, index) => {
            const item = plan[row.key];
            const location = item.location?.trim() || '—';
            const time = item.time?.trim();

            return (
              <View
                key={row.key}
                style={[
                  styles.infoRow,
                  index !== rows.length - 1 && styles.infoRowBorder,
                ]}
              >
                <Text style={styles.infoLabel}>{row.label}</Text>

                <Text style={styles.infoLocation} numberOfLines={2}>
                  {location}
                </Text>

                <Text style={styles.infoTime}>
                  {time || ''}
                </Text>
              </View>
            );
          })}

          {(distanceText || plan.route) && (
            <View style={[styles.infoRow, styles.routeRow]}>
              <Text style={styles.infoLabel}>Trasa</Text>

              <Text style={styles.infoLocation}>
                {distanceText || 'Mapa'}
              </Text>

              {plan.route ? (
                <TouchableOpacity
                  style={styles.routeMiniButton}
                  onPress={openRouteLink}
                  activeOpacity={0.85}
                >
                  <Text style={styles.routeMiniButtonText}>Otwórz</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.infoTime} />
              )}
            </View>
          )}
        </View>

        {!!imageSource && (
          <TouchableOpacity
            onPress={() => setImageModalVisible(true)}
            activeOpacity={0.9}
            style={styles.imageWrapper}
          >
            <Image
              source={imageSource}
              style={styles.thumb}
              resizeMode="contain"
            />

            <Text style={styles.zoomHint}>
              Dotknij mapy, aby powiększyć
            </Text>
          </TouchableOpacity>
        )}

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

      {!!imageSource && (
        <ImageViewing
          images={imageViewerImages}
          imageIndex={0}
          visible={imageModalVisible}
          onRequestClose={() => setImageModalVisible(false)}
          backgroundColor="#000"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0e8569',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0e8569',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
  },

  wrapper: {
    padding: 16,
  },

  headerContainer: {
    backgroundColor: '#01503d',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
  },
  intentionTitle: {
    fontSize: 14,
    color: '#d8eee8',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: '600',
  },
  intentionText: {
    fontSize: 18,
    color: '#f2d94e',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 24,
  },

  infoBox: {
    backgroundColor: '#01503d',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  infoRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.16)',
  },
  routeRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.16)',
  },
  infoLabel: {
    width: 62,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f2d94e',
  },
  infoLocation: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    lineHeight: 21,
    paddingRight: 8,
  },
  infoTime: {
    width: 58,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
  },

  routeMiniButton: {
    backgroundColor: '#f2d94e',
    paddingVertical: Platform.OS === 'ios' ? 7 : 5,
    paddingHorizontal: 9,
    borderRadius: 7,
  },
  routeMiniButtonText: {
    color: '#01503d',
    fontSize: 14,
    fontWeight: 'bold',
  },

  imageWrapper: {
    backgroundColor: '#01503d',
    borderRadius: 12,
    padding: 8,
  },
  thumb: {
    width: W - 48,
    height: (W - 48) * 0.78,
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: '#103f35',
  },
  zoomHint: {
    color: '#d8eee8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 7,
  },

  linkButtonContainer: {
    marginTop: 14,
    alignItems: 'center',
  },
  routeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2d94e',
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 12,
    borderRadius: 8,
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
});         