// components/Tile.tsx
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType
} from 'react-native'

type Props = {
  title: string
  icon: ImageSourcePropType
  color: string
  onPress: () => void
  titleStyle?: object
  accessoryIcon?: ImageSourcePropType
}

export default function Tile({ title, icon, color, onPress, titleStyle, accessoryIcon }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconWrapper, { backgroundColor: color }]}>  
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>
      <View style={styles.textWrapper}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>
      {accessoryIcon && (
        <View style={styles.accessoryWrapper}>
          <Image source={accessoryIcon} style={styles.accessoryIcon} resizeMode="contain" />
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    marginVertical: 6,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  iconWrapper: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 32,
    height: 32
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  accessoryWrapper: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  accessoryIcon: {
    width: 24,
    height: 24
  }
})