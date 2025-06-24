// screens/SpiewnikDetailScreen.tsx
import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
  TouchableOpacity,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SpiewnikDetailScreen({ route }: any) {
  const song = route?.params?.song;
  if (!song) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Brak danych pieśni</Text>
      </View>
    );
  }

  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isPortrait = height >= width;
  const scrollRef = useRef<ScrollView>(null);

  // --- Font size ---
  const [fontSize, setFontSize] = useState(17);
  const FONT_KEY = '@spiewnik_font_size';

  // --- Background themes ---
  const bgThemes = [
    { name: 'Jasnozielone',  bg: '#0e8569' },
    { name: 'Ciemnozielone', bg: '#01503d' },
    { name: 'Białe',         bg: '#ffffff' },
    { name: 'Szare',         bg: '#333333' },
    { name: 'Czarne',        bg: '#000000' },
  ];
  const [bgIndex, setBgIndex] = useState(0);
  const BG_KEY = '@spiewnik_bg_theme';

  // --- Text colors ---
  const textColors = [
    { name: 'Biały',   fg: '#ffffff' },
    { name: 'Czarny',  fg: '#000000' },
    { name: 'Żółty',   fg: '#f2d94e' },
  ];
  const [fgIndex, setFgIndex] = useState(0);
  const FG_KEY = '@spiewnik_fg_color';

  // Modal
  const [menuVisible, setMenuVisible] = useState(false);

  // Show “scroll to top” button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load persisted settings (fontSize domyślnie 16)
  useEffect(() => {
    AsyncStorage.getItem(FONT_KEY).then(v => {
      if (v != null) {
        const n = Number(v);
        if (!isNaN(n) && n > 0) {
          setFontSize(n);
        }
      }
    });
    AsyncStorage.getItem(BG_KEY).then(v => {
      const i = Number(v);
      if (!isNaN(i) && i >= 0 && i < bgThemes.length) setBgIndex(i);
    });
    AsyncStorage.getItem(FG_KEY).then(v => {
      const i = Number(v);
      if (!isNaN(i) && i >= 0 && i < textColors.length) setFgIndex(i);
    });
  }, []);

  // Adjust font size
  const adjustFont = async (delta: number) => {
    let sz = fontSize + delta;
    sz = Math.max(12, Math.min(30, sz));
    setFontSize(sz);
    await AsyncStorage.setItem(FONT_KEY, sz.toString());
  };

  // Select background theme
  const selectBg = async (i: number) => {
    setBgIndex(i);
    await AsyncStorage.setItem(BG_KEY, i.toString());
  };

  // Select text color
  const selectFg = async (i: number) => {
    setFgIndex(i);
    await AsyncStorage.setItem(FG_KEY, i.toString());
  };

  // StatusBar
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

  const bg = bgThemes[bgIndex].bg;
  const fg = textColors[fgIndex].fg;

  // onScroll handler
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    setShowScrollTop(y > 200);
  };

  // scroll to top
  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Menu bar */}
      <View style={styles.menuBar}>
        <Text style={styles.menuTitle} numberOfLines={1}>
          {song.title}
        </Text>
        <View style={styles.menuButtons}>
          <TouchableOpacity onPress={() => adjustFont(-1)} style={styles.menuBtn}>
            <Text style={styles.menuBtnText}>–</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => adjustFont(1)} style={styles.menuBtn}>
            <Text style={styles.menuBtnText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuBtn}>
            <Text style={styles.menuBtnText}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal wyboru tła i koloru tekstu */}
      <Modal transparent visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.modalContainer} pointerEvents="box-none">
            <View style={styles.modalContent}>
              {/* Background picker */}
              <Text style={styles.modalTitle}>Wybierz kolor tła:</Text>
              {bgThemes.map((t, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.modalItem,
                    bgIndex === i && styles.modalItemSelected,
                  ]}
                  onPress={() => selectBg(i)}
                >
                  <Text style={styles.modalItemText}>{t.name}</Text>
                </TouchableOpacity>
              ))}

              {/* Text color picker */}
              <Text style={[styles.modalTitle, { marginTop: 16 }]}>
                Wybierz kolor tekstu:
              </Text>
              {textColors.map((t, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.modalItem,
                    fgIndex === i && styles.modalItemSelected,
                  ]}
                  onPress={() => selectFg(i)}
                >
                  <Text style={styles.modalItemText}>{t.name}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[styles.modalCloseButton, { marginTop: 20 }]}
                onPress={() => setMenuVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Zamknij</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Treść pieśni */}
      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 16, backgroundColor: bg },
        ]}
      >
        <Text style={[styles.text, { fontSize, color: fg }]}>{song.text}</Text>
        {/* Pusty wypełniacz, aby zawsze kolorować ekran */}
        <View style={{ flex: 1, backgroundColor: bg }} />
      </ScrollView>

      {/* Scroll to Top button */}
      {showScrollTop && (
        <TouchableOpacity
          style={[
            styles.topButton,
            { bottom: insets.bottom + 20, right: 20 },
          ]}
          onPress={scrollToTop}
        >
          <Text style={styles.topButtonText}>⇧</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1 },
  menuBar:     {
    flexDirection: 'row',
    backgroundColor: '#01503d',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  menuTitle:   { color: '#f2d94e', fontSize: 20, fontWeight: 'bold', flex: 1 },
  menuButtons: { flexDirection: 'row' },
  menuBtn:     { marginLeft: 12, padding: 8, borderRadius: 12, color: '#f2d94e' },
  menuBtnText: { color: '#f2d94e', fontSize: 22, fontWeight: 'bold' },

  content:   { padding: 16 },
  text:      { lineHeight: 24 },

  topButton:     {
    position: 'absolute',
    backgroundColor: '#01503d',
    padding: 16,
    borderRadius: 16,
    elevation: 12,
  },
  topButtonText: {
    fontSize: 20,
    color: '#f2d94e',
    fontWeight: 'bold',
    lineHeight: 24,
  },

  modalOverlay:         {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer:      {
    width: '100%',
    alignItems: 'center',
  },
  modalContent:        {
    width: '80%',
    backgroundColor: '#0e8569',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  modalTitle:          {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#f2d94e',
  },
  modalItem:           {
    paddingVertical: 10,
  },
  modalItemSelected:   {
    backgroundColor: '#01503d',
  },
  modalItemText:       {
    fontSize: 16,
    color: '#f2d94e',
    textAlign: 'center',
  },
  modalCloseButton:    {
    backgroundColor: '#01503d',
    borderRadius: 6,
    paddingVertical: 10,
  },
  modalCloseButtonText:{
    fontSize: 16,
    color: '#f2d94e',
    textAlign: 'center',
  },
});
