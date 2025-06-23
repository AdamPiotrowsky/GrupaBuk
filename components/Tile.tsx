// components/Tile.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';

/* ---------- props ---------- */
type Props = {
  title: string;
  color: string;                          // tło kafelka
  onPress: () => void;
  icon: ImageSourcePropType;              // główna ikonka (PNG / JPG)
  accessoryIcon?: ImageSourcePropType;    // opcjonalnie po prawej
  titleStyle?: object;
};

export default function Tile({
  title,
  color,
  onPress,
  icon,
  accessoryIcon,
  titleStyle,
}: Props) {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: color }]} onPress={onPress}>
      {/* ikona po lewej */}
      <View style={styles.iconWrapper}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>

      {/* tytuł */}
      <View style={styles.textWrapper}>
        <Text style={[styles.title, titleStyle]} numberOfLines={2}>
          {title}
        </Text>
      </View>

      {/* opcjonalna ikonka po prawej */}
      {accessoryIcon && (
        <View style={styles.accessoryWrapper}>
          <Image source={accessoryIcon} style={styles.accessoryIcon} resizeMode="contain" />
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',   // dodane, aby wszystkie dzieci były wyśrodkowane w pionie
    height: 60,
    marginVertical: 5,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 22,
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  /* ikona  -------------------------------------------------- */
  iconWrapper: { width: 60, justifyContent: 'center', alignItems: 'center' },
  icon:        { width: 38, height: 38 },

  /* tytuł  -------------------------------------------------- */
  textWrapper: { flex: 1, justifyContent: 'center', paddingHorizontal: 4 },
  title: {
    fontSize: 18,
    fontFamily: 'LeagueSpartan-Bold',
    color: '#f2d94e',
    letterSpacing: -0.5,
    lineHeight: 30
  },

  /* accessory  --------------------------------------------- */
  accessoryWrapper: { width: 40, justifyContent: 'center', alignItems: 'center' },
  accessoryIcon:    { width: 70, height: 70, marginRight: 12 },
});
