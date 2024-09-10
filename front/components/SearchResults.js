import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import SearchBar from "../pages/SearchBar"; // Importation de la SearchBar

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
            onPress={() =>
              navigation.navigate("CompanyDetails", { company: item })
            }
          >
            <Text style={styles.resultItem}>{item.name}</Text>
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
  resultItem: {
    padding: 15,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
