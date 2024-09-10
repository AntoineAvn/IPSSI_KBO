import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Keyboard, StyleSheet } from 'react-native';
import SearchBar from './SearchBar'; // Importation de la SearchBar

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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Réutilisation de la SearchBar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        placeholder="Rechercher une entreprise..."
      />

      <Text style={styles.title}>{company.name}</Text>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations générales</Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Numéro d'enregistrement: </Text>
          {company.registrationNumber}
        </Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Adresse: </Text>
          {company.address}
        </Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Forme légale: </Text>
          {company.legalForm}
        </Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Statut: </Text>
          {company.status}
        </Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Date de création: </Text>
          {company.creationDate}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
    elevation: 5, // Pour Android
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
