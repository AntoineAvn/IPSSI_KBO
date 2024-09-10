import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import SearchBar from "../components/SearchBar"; // Importation de la SearchBar

const mockData = [
  {
    id: "1",
    name: "Uber",
    registrationNumber: "123456",
    address: "123 Rue de Paris, Bruxelles",
    legalForm: "SA",
    status: "Actif",
    creationDate: "2010-01-01",
  },
  {
    id: "2",
    name: "Uber Eats",
    registrationNumber: "654321",
    address: "456 Avenue Louise, Bruxelles",
    legalForm: "SRL",
    status: "Actif",
    creationDate: "2015-05-15",
  },
];

export default function SearchResults({ route, navigation }) {
  const { query } = route.params;
  const [searchQuery, setSearchQuery] = useState(query);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filtered = mockData.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  }, [query]);

  const handleSearch = () => {
    const filtered = mockData.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <View style={styles.container}>
      {/* Réutilisation de la SearchBar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        placeholder="Rechercher à nouveau..."
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("CompanyDetails", { company: item })
            }
          >
            <View style={styles.cardContent}>
              <Text style={styles.companyName}>{item.name}</Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Numéro d'enregistrement: </Text>
                {item.registrationNumber}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Adresse: </Text>
                {item.address}
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
    color: "#333",
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
});
