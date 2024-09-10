import 'react-native-gesture-handler'; // Importation nécessaire pour react-navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home'; // Importation correcte du composant Home
import SearchResults from './components/SearchResults';
import CompanyDetails from './components/CompanyDetails';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Les composants sont passés correctement dans la prop `component` */}
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="SearchResults" component={SearchResults} options={{ title: 'Résultats de la recherche' }} />
        <Stack.Screen name="CompanyDetails" component={CompanyDetails} options={{ title: 'Détails de l\'entreprise' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
