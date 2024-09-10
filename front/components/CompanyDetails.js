import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard, StyleSheet } from 'react-native';

export default function CompanyDetails({ route, navigation }) {
  const { company } = route.params;
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      Keyboard.dismiss();
      navigation.navigate('SearchResults', { query: searchQuery });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
        <View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Rechercher une entreprise..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Rechercher</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{company.name}</Text>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informations générales</Text>
            <Text style={styles.infoItem}><Text style={styles.infoLabel}>Numéro d'enregistrement: </Text>{company.registrationNumber}</Text>
            <Text style={styles.infoItem}><Text style={styles.infoLabel}>Adresse: </Text>{company.address}</Text>
            <Text style={styles.infoItem}><Text style={styles.infoLabel}>Forme légale: </Text>{company.legalForm}</Text>
            <Text style={styles.infoItem}><Text style={styles.infoLabel}>Statut: </Text>{company.status}</Text>
            <Text style={styles.infoItem}><Text style={styles.infoLabel}>Date de création: </Text>{company.creationDate}</Text>
          </View>
        </View>

      </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 15,
  },
  infoItem: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
});
