import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Nunito': require('./assets/fonts/Nunito-VariableFont_wght.ttf'),
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#F0F2F5' }} />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <HomeScreen />
    </>
  );
}
