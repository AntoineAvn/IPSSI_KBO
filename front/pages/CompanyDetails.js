import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Keyboard,
  StyleSheet,
} from "react-native";
import SearchBar from "../components/SearchBar"; // Importation de la SearchBar

// Fonction utilitaire pour formater la date
const formatDate = (dateString) => {
  if (!dateString) return "Non disponible";
  const date = new Date(dateString.split('-').reverse().join('-')); // Transformer la chaîne en objet Date
  return date.toLocaleDateString('fr-FR'); // Retourner la date formatée en français
};

export default function CompanyDetails({ route, navigation }) {
  const { company } = route.params;
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      Keyboard.dismiss();
      navigation.navigate("SearchResults", { query: searchQuery });
    }
  };

  console.log('Company details:', company.activity);

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
        {company.enterpriseName || "Nom de l'entreprise indisponible"}
      </Text>

      {/* Informations générales */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations générales</Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Numéro d'enregistrement: </Text>
          {company.enterpriseNumber || "Non disponible"}
        </Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Forme légale: </Text>
          {company.info?.JuridicalForm || "Non disponible"}
        </Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Statut: </Text>
          {company.info?.Status || "Non disponible"}
        </Text>
        <Text style={styles.infoItem}>
          <Text style={styles.infoLabel}>Date de création: </Text>
          {formatDate(company.info?.StartDate)}
        </Text>
      </View>

      {/* Adresse */}
      {company.address && company.address.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Adresse</Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Rue: </Text>
            {`${company.address[0].Street || "Non disponible"} ${company.address[0].HouseNumber || ""}`}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Commune: </Text>
            {company.address[0].Municipality || "Non disponible"}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Code Postal: </Text>
            {company.address[0].Zipcode || "Non disponible"}
          </Text>
        </View>
      )}

      {/* Activité */}
      {company.activity && company.activity.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Activité</Text>
          {company.activity.map((act, index) => (
            <View key={index}>
              <Text style={styles.infoItem}>
                <Text style={styles.infoLabel}>Groupe d'activité: </Text>
                {act.ActivityGroup || "Non disponible"}
              </Text>
              <Text style={styles.infoItem}>
                <Text style={styles.infoLabel}>Version NACE: </Text>
                {act.NaceVersion || "Non disponible"}
              </Text>
              <Text style={styles.infoItem}>
                <Text style={styles.infoLabel}>Code NACE: </Text>
                {act.NaceCode || "Non disponible"}
              </Text>
              <Text style={styles.infoItem}>
                <Text style={styles.infoLabel}>Classification: </Text>
                {act.Classification || "Non disponible"}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Contact */}
      {company.contact && company.contact.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact</Text>
          {company.contact.map((cont, index) => (
            <View key={index}>
              <Text style={styles.infoItem}>
                <Text style={styles.infoLabel}>Type de contact: </Text>
                {cont.ContactType || "Non disponible"}
              </Text>
              <Text style={styles.infoItem}>
                <Text style={styles.infoLabel}>Valeur du contact: </Text>
                {cont.Value || "Non disponible"}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Branche */}
      {company.branch && company.branch.address && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Adresse de la branche</Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Rue: </Text>
            {`${company.branch.address.Street || "Non disponible"} ${company.branch.address.HouseNumber || ""}`}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Commune: </Text>
            {company.branch.address.Municipality || "Non disponible"}
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
