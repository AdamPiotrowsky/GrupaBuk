// src/components/Tile.tsx
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
}

export default function Tile({ title, icon, color, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconWrapper, { backgroundColor: color }]}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  iconWrapper: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 48,
    height: 48
  },
  textWrapper: {
    width: '80%',
    justifyContent: 'center',
    paddingLeft: 12
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000'
  }
})
