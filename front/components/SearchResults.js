import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const mockData = [
  { id: '1', name: 'Uber', registrationNumber: '123456', address: '123 Rue de Paris, Bruxelles', legalForm: 'SA', status: 'Actif', creationDate: '2010-01-01' },
  { id: '2', name: 'Uber Eats', registrationNumber: '654321', address: '456 Avenue Louise, Bruxelles', legalForm: 'SRL', status: 'Actif', creationDate: '2015-05-15' },
];

// Search Bar Component
const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => (
  <View style={styles.searchContainer}>
    <TextInput
      style={styles.searchBar}
      placeholder="Rechercher à nouveau..."
      value={searchQuery}
      onChangeText={setSearchQuery}
      onSubmitEditing={handleSearch}
    />
    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
      <Text style={styles.searchButtonText}>Rechercher</Text>
    </TouchableOpacity>
  </View>
);

// Search Result Item Component
const SearchResultItem = React.memo(({ item, navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('CompanyDetails', { company: item })}>
    <Text style={styles.resultItem}>{item.name}</Text>
  </TouchableOpacity>
));

export default function SearchResults({ route, navigation }) {
  const { query } = route.params;
  const [searchQuery, setSearchQuery] = useState(query);
  const [filteredData, setFilteredData] = useState([]);

  // Filtering data based on query
  useEffect(() => {
    const filtered = mockData.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredData(filtered);
  }, [query]);

  const handleSearch = useCallback(() => {
    const filtered = mockData.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredData(filtered);
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SearchResultItem item={item} navigation={navigation} />}
        ListEmptyComponent={() => <Text style={styles.noResultsText}>Aucun résultat trouvé</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultItem: {
    padding: 15,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});
