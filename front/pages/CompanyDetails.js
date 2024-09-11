import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Keyboard,
  StyleSheet,
} from "react-native";
import SearchBar from "../components/SearchBar"; // Importation de la SearchBar

export default function CompanyDetails({ route, navigation }) {
  const { company } = route.params;
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      Keyboard.dismiss();
      navigation.navigate("SearchResults", { query: searchQuery });
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

      {/* Dénomination */}
      <Text style={styles.title}>
        {company.denomination?.Denomination || "Nom de l'entreprise indisponible"}
      </Text>

      {/* Informations générales */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations générales</Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Numéro d'enregistrement: </Text>
          {company.registrationNumber || "Non disponible"}
        </Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Forme légale: </Text>
          {company.legalForm || "Non disponible"}
        </Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Statut: </Text>
          {company.status || "Non disponible"}
        </Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Date de création: </Text>
          {company.creationDate || "Non disponible"}
        </Text>
      </View>

      {/* Adresse */}
      {company.address && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Adresse</Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Rue: </Text>
            {`${company.address.StreetFR || "Non disponible"} ${company.address.HouseNumber || ""}`}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Commune: </Text>
            {company.address.MunicipalityFR || "Non disponible"}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Code Postal: </Text>
            {company.address.Zipcode || "Non disponible"}
          </Text>
        </View>
      )}

      {/* Activité */}
      {company.activity && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Activité</Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Groupe d'activité: </Text>
            {company.activity.ActivityGroup || "Non disponible"}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version NACE: </Text>
            {company.activity.NaceVersion || "Non disponible"}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Code NACE: </Text>
            {company.activity.NaceCode || "Non disponible"}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Classification: </Text>
            {company.activity.Classification || "Non disponible"}
          </Text>
        </View>
      )}

      {/* Contact */}
      {company.contact && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Type de contact: </Text>
            {company.contact.ContactType || "Non disponible"}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Valeur du contact: </Text>
            {company.contact.ContactValue || "Non disponible"}
          </Text>
        </View>
      )}

      {/* Branche */}
      {company.branch && company.branch.address && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Adresse de la branche</Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Rue: </Text>
            {`${company.branch.address.StreetFR || "Non disponible"} ${company.branch.address.HouseNumber || ""}`}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Commune: </Text>
            {company.branch.address.MunicipalityFR || "Non disponible"}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Code Postal: </Text>
            {company.branch.address.Zipcode || "Non disponible"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  infoSection: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Pour Android
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 15,
  },
  infoItem: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#555",
  },
});
