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
  const [page, setPage] = useState(1); // Gérer la page actuelle
  const [loading, setLoading] = useState(true); // Pour afficher un indicateur de chargement
  const [loadingMore, setLoadingMore] = useState(false); // Pour charger plus de résultats
  const [hasMore, setHasMore] = useState(true); // Savoir s'il y a plus de résultats à charger
  const [error, setError] = useState(null); // Pour gérer les erreurs

  const getBackendUrl = () => {
    const debuggerHost = Constants.expoConfig.hostUri; // Récupérer l'URL du metro bundler pour communiquer avec le backend
    const ip = debuggerHost.split(':')[0]; // Extraire l'IP depuis debuggerHost
    return `http://${ip}:3000`; // Construire l'URL du backend
  };

  const fetchData = async (pageNumber) => {
    try {
      if (pageNumber === 1) {
        setLoading(true); // Début du chargement pour la première page
      } else {
        setLoadingMore(true); // Chargement de plus de résultats
      }

      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/enterprises/search?name=${searchQuery}&page=${pageNumber}`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const data = await response.json();

      // Ajouter les nouveaux résultats à la liste existante
      if (pageNumber === 1) {
        setFilteredData(data.enterprises); // Mettre à jour les résultats pour la première page
      } else {
        setFilteredData((prevData) => [...prevData, ...data.enterprises]); // Ajouter les résultats à la fin
      }

      // Vérifier s'il y a encore plus de résultats à charger
      setHasMore(pageNumber < data.totalPages);

    } catch (err) {
      setError(err.message); // Gérer l'erreur
    } finally {
      setLoading(false);
      setLoadingMore(false); // Fin du chargement
    }
  };

  useEffect(() => {
    fetchData(1); // Charger la première page au début
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setPage((prevPage) => prevPage + 1); // Incrémenter la page actuelle
      fetchData(page + 1); // Charger la page suivante
    }
  };

  const handleSearch = () => {
    setPage(1); // Réinitialiser la page à 1 lors de la nouvelle recherche
    setFilteredData([]); // Réinitialiser les résultats
    fetchData(1); // Charger les nouvelles données
  };

  if (loading && page === 1) {
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
        onEndReached={handleLoadMore} // Charger plus de résultats quand on arrive en bas de la liste
        onEndReachedThreshold={0.5} // Déclenchement quand il reste 50% de la liste à défiler
        ListFooterComponent={loadingMore && <ActivityIndicator size="small" color="#107aca" />} // Indicateur de chargement à la fin de la liste
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
