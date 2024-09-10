import 'react-native-gesture-handler'; // Importation nécessaire pour react-navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home'; // Importation de la page Home
import SearchResults from './pages/SearchResults'; // Importation de la page SearchResults
import CompanyDetails from './pages/CompanyDetails'; // Importation de la page CompanyDetails

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#107aca', // Couleur de fond du header pour toutes les pages
          },
          headerTintColor: '#fff', // Couleur du texte et des icônes (comme "Back")
          headerTitleStyle: {
            fontWeight: 'bold', // Style du titre
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Accueil' }} // Le titre personnalisé pour la page d'accueil
        />
        <Stack.Screen
          name="SearchResults"
          component={SearchResults}
          options={{ title: 'Résultats de la recherche' }} // Le titre personnalisé pour cette page
        />
        <Stack.Screen
          name="CompanyDetails"
          component={CompanyDetails}
          options={{ title: 'Détails de l\'entreprise' }} // Le titre personnalisé pour cette page
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
