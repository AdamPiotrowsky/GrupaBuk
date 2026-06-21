// screens/IntentionScreen.tsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/MyText';
import MyTextInput from '../components/MyTextInput';
import { supabase } from '../lib/supabase';

const MIN_LENGTH = 3;
const MAX_LENGTH = 1000;
const ADMIN_PASSWORD = 'klerykkuba';

const DEVICE_ID_KEY = 'grupa_buk_device_id';
const LAST_INTENTION_DATE_KEY = 'grupa_buk_last_intention_date';

function getTodayTitle() {
  const today = new Date();

  const formattedDate = today.toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
  });

  return `Intencje, ${formattedDate}`;
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

function createDeviceId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

async function getOrCreateDeviceId() {
  const existingDeviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);

  if (existingDeviceId) {
    return existingDeviceId;
  }

  const newDeviceId = createDeviceId();
  await AsyncStorage.setItem(DEVICE_ID_KEY, newDeviceId);

  return newDeviceId;
}

export default function IntentionScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  const inputRef = useRef<TextInput | null>(null);

  const secretTapCount = useRef(0);
  const secretTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [intention, setIntention] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadySubmittedToday, setAlreadySubmittedToday] = useState(false);

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const trimmedIntention = intention.trim();

  const validationMessage = useMemo(() => {
    if (!touched) return '';

    if (trimmedIntention.length < MIN_LENGTH) {
      return 'Wpisz treść intencji.';
    }

    return '';
  }, [touched, trimmedIntention.length]);

  // TODO
  // const canSubmit =
  //   trimmedIntention.length >= MIN_LENGTH &&
  //   intention.length <= MAX_LENGTH &&
  //   !isSubmitting &&
  //   !alreadySubmittedToday;

     const canSubmit =
    trimmedIntention.length >= MIN_LENGTH &&
    intention.length <= MAX_LENGTH &&
    !isSubmitting;

  useEffect(() => {
    StatusBar.setBackgroundColor('#333333');
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(false);
  }, [isPortrait]);

  useEffect(() => {
    navigation.setOptions({
      title: getTodayTitle(),
    });
  }, [navigation]);

  useEffect(() => {
    const checkLocalSubmission = async () => {
      try {
        const today = getTodayDateForDb();
        const lastDate = await AsyncStorage.getItem(LAST_INTENTION_DATE_KEY);

        if (lastDate === today) {
          setAlreadySubmittedToday(true);
        }
      } catch (error) {
        console.log('Check local submission error:', error);
      }
    };

    checkLocalSubmission();
  }, []);

  useEffect(() => {
    return () => {
      if (secretTapTimer.current) {
        clearTimeout(secretTapTimer.current);
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#333333');
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(false);
    }, [])
  );

  const handleSubmit = async () => {
    setTouched(true);

    if (alreadySubmittedToday) {
      Alert.alert(
        'Intencja już wysłana',
        'Z tego urządzenia wysłano już dzisiaj intencję.'
      );
      return;
    }

    if (!trimmedIntention || trimmedIntention.length < MIN_LENGTH) {
      Alert.alert('Uzupełnij intencję', 'Wpisz treść intencji.');
      return;
    }

    if (intention.length > MAX_LENGTH) {
      Alert.alert(
        'Za długa intencja',
        `Intencja może mieć maksymalnie ${MAX_LENGTH} znaków.`
      );
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const today = getTodayDateForDb();
      const deviceId = await getOrCreateDeviceId();

      const localLastDate = await AsyncStorage.getItem(LAST_INTENTION_DATE_KEY);

      if (localLastDate === today) {
        setAlreadySubmittedToday(true);

        Alert.alert(
          'Intencja już wysłana',
          'Z tego urządzenia wysłano już dzisiaj intencję.'
        );
        return;
      }

      const { error } = await supabase.from('intentions').insert({
        intention_date: today,
        content: trimmedIntention,
        device_id: deviceId,
      });

      if (error) {
        if (error.code === '23505') {
          await AsyncStorage.setItem(LAST_INTENTION_DATE_KEY, today);
          setAlreadySubmittedToday(true);

          Alert.alert(
            'Intencja już wysłana',
            'Z tego urządzenia wysłano już dzisiaj intencję.'
          );
          return;
        }

        console.log('Supabase insert error:', error);

        Alert.alert(
          'Nie udało się wysłać',
          'Sprawdź połączenie z internetem i spróbuj ponownie.'
        );
        return;
      }

      await AsyncStorage.setItem(LAST_INTENTION_DATE_KEY, today);

      setAlreadySubmittedToday(true);
      setIntention('');
      setTouched(false);

      Alert.alert(
        'Dziękujemy',
        'Twoja intencja została wysłana.'
      );
    } catch (error) {
      console.log('Send intention error:', error);

      Alert.alert(
        'Nie udało się wysłać',
        'Wystąpił problem podczas wysyłania intencji. Spróbuj ponownie za chwilę.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSecretPress = () => {
    secretTapCount.current += 1;

    if (secretTapTimer.current) {
      clearTimeout(secretTapTimer.current);
    }

    secretTapTimer.current = setTimeout(() => {
      secretTapCount.current = 0;
    }, 2000);

    if (secretTapCount.current >= 5) {
      secretTapCount.current = 0;

      if (secretTapTimer.current) {
        clearTimeout(secretTapTimer.current);
        secretTapTimer.current = null;
      }

      setAdminPassword('');
      setPasswordError('');
      setPasswordModalVisible(true);
    }
  };

  const closePasswordModal = () => {
    setPasswordModalVisible(false);
    setAdminPassword('');
    setPasswordError('');
  };

  const handleAdminPasswordSubmit = () => {
    if (adminPassword.trim() === ADMIN_PASSWORD) {
      setPasswordModalVisible(false);
      setAdminPassword('');
      setPasswordError('');

      navigation.navigate('IntentionsReader');
      return;
    }

    setPasswordError('Nieprawidłowe hasło.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={styles.card}>
          <Text style={styles.label}>Wpisz swoją intencję</Text>

          <MyTextInput
            ref={inputRef}
            style={[
              styles.textArea,
              validationMessage && !alreadySubmittedToday ? styles.textAreaError : null,
              alreadySubmittedToday ? styles.textAreaDisabled : null,
            ]}
            value={intention}
            onChangeText={(text) => {
              if (text.length <= MAX_LENGTH) {
                setIntention(text);
              }
            }}
            onBlur={() => setTouched(true)}
            placeholder={
              alreadySubmittedToday
                ? 'Dzisiaj wysłano już intencję z tego urządzenia.'
                : 'Wpisz tutaj swoją intencję...'
            }
            placeholderTextColor="#b7d4cc"
            multiline
            textAlignVertical="top"
            autoCorrect
            autoCapitalize="sentences"
            returnKeyType="default"
            maxLength={MAX_LENGTH}
            editable={!alreadySubmittedToday && !isSubmitting}
          />

          {!!validationMessage && !alreadySubmittedToday && (
            <Text style={styles.errorText}>{validationMessage}</Text>
          )}

          {alreadySubmittedToday && (
            <Text style={styles.sentInfoText}>
              Dzisiaj wysłano już intencję z tego urządzenia.
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              !canSubmit ? styles.submitButtonDisabled : null,
            ]}
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting
                ? 'Wysyłanie...'
                : alreadySubmittedToday
                  ? 'Intencja wysłana dzisiaj'
                  : 'Wyślij intencję'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.infoText}>
            Twoją intencję przeczytamy na wieczornym różańcu, który będzie transmitowany na naszym Facebooku.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={1}
          onPress={handleSecretPress}
          style={styles.secretButton}
        />
      </ScrollView>

      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closePasswordModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.passwordModal}>
            <MyTextInput
              style={styles.passwordInput}
              value={adminPassword}
              onChangeText={(text) => {
                setAdminPassword(text);
                setPasswordError('');
              }}
              placeholder="Hasło"
              placeholderTextColor="#b7d4cc"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleAdminPasswordSubmit}
            />

            {!!passwordError && (
              <Text style={styles.passwordError}>{passwordError}</Text>
            )}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.cancelButton}
                onPress={closePasswordModal}
              >
                <Text style={styles.cancelButtonText}>Anuluj</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.confirmButton}
                onPress={handleAdminPasswordSubmit}
              >
                <Text style={styles.confirmButtonText}>Wejdź</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0e8569',
  },

  scrollContent: {
    flexGrow: 1,
  },

  card: {
    backgroundColor: '#01503d',
    marginHorizontal: 16,
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },

  label: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#f2d94e',
    marginBottom: 10,
  },

  textArea: {
    minHeight: 210,
    maxHeight: 340,
    backgroundColor: '#0e8569',
    borderWidth: 1,
    borderColor: '#f2d94e',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    lineHeight: 24,
    color: '#fff',
  },

  textAreaDisabled: {
    opacity: 0.75,
  },

  textAreaError: {
    borderColor: '#ffb3b3',
  },

  errorText: {
    color: '#ffdddd',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },

  sentInfoText: {
    color: '#f2d94e',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },

  submitButton: {
    marginTop: 18,
    backgroundColor: '#f2d94e',
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  submitButtonDisabled: {
    opacity: 0.55,
  },

  submitButtonText: {
    color: '#01503d',
    fontSize: 17,
    fontWeight: 'bold',
  },

  infoText: {
    color: '#d8eee8',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 12,
    textAlign: 'center',
  },

  secretButton: {
    height: 74,
    marginTop: 80,
    marginHorizontal: 80,
    backgroundColor: '#0e8569',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },

  passwordModal: {
    width: '100%',
    backgroundColor: '#01503d',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(242, 217, 78, 0.35)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  passwordInput: {
    backgroundColor: '#0e8569',
    borderWidth: 1,
    borderColor: '#f2d94e',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 17,
    color: '#fff',
  },

  passwordError: {
    color: '#ffdddd',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },

  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#0e8569',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(242, 217, 78, 0.35)',
  },

  cancelButtonText: {
    color: '#f2d94e',
    fontSize: 16,
    fontWeight: 'bold',
  },

  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f2d94e',
    alignItems: 'center',
  },

  confirmButtonText: {
    color: '#01503d',
    fontSize: 16,
    fontWeight: 'bold',
  },
});