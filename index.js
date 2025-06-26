// index.js
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent zapewnia, że Twoja aplikacja odpali się
// zarówno w Expo Go jak i w natywnym buildzie
registerRootComponent(App);
