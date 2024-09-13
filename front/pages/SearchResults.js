import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import SearchBar from "../components/SearchBar"; // Importation de la SearchBar
import Constants from 'expo-constants';

export default function SearchResults({ route, navigation }) {
  const { query } = route.params;
  const [searchQuery, setSearchQuery] = useState(query);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true); // Pour afficher un indicateur de chargement
  const [error, setError] = useState(null); // Pour gérer les erreurs

  const getBackendUrl = () => {
    const debuggerHost = Constants.expoConfig.hostUri; // Récupérer l'URL du metro bundler pour communiquer le backend
    // console.log('debuggerHost:', debuggerHost);
    const ip = debuggerHost.split(':')[0]; // Extraire l'IP depuis debuggerHost
    return `http://${ip}:3000`; // Construire l'URL du backend
  };

  useEffect(() => {
    // Fonction pour envoyer la requête à l'API
    const fetchData = async () => {
      try {
        setLoading(true); // Début du chargement

        // Remplace l'URL par celle de ton backend (par exemple : http://localhost:3000/api/enterprises/search)
        // const response = await fetch(`http://10.74.0.196:3000/api/enterprises/search?name=${searchQuery}`);
        const backendUrl = getBackendUrl(); // Récupérer dynamiquement l'URL du backend
        const response = await fetch(`${backendUrl}/api/enterprises/search?name=${searchQuery}`);


        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const data = await response.json(); // Parse la réponse JSON
        setFilteredData(data); // Mettre à jour les données avec les résultats de l'API
      } catch (err) {
        setError(err.message); // Gérer l'erreur
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchData();
  }, [searchQuery]);

  const handleSearch = () => {
    // Mettre à jour la recherche lorsque l'utilisateur utilise la SearchBar
    setSearchQuery(searchQuery);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#107aca" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        placeholder="Rechercher à nouveau..."
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item._id} // Assure-toi que tes objets ont un champ `_id`
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("CompanyDetails", { company: item })
            }
          >
            <View style={styles.cardContent}>
              <Text style={styles.companyName}>{item.enterpriseName}</Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Numéro d'enregistrement: </Text>
                {item.enterpriseNumber}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Adresse: </Text>
                {`${item.address.StreetFR}, ${item.address.HouseNumber}, ${item.address.MunicipalityFR}, ${item.address.Zipcode}`}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Forme légale: </Text>
                {item.legalForm}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Statut: </Text>
                {item.status}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Date de création: </Text>
                {item.creationDate}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.noResultsText}>Aucun résultat trouvé</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Pour Android
  },
  cardContent: {
    flexDirection: "column",
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#107aca",
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  label: {
    fontWeight: "bold",
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
