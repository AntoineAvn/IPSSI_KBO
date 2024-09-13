import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Keyboard,
  StyleSheet,
} from "react-native";
import SearchBar from "../components/SearchBar";

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
      <Text selectable={true} style={styles.title}>
        {company.enterpriseName || "Nom de l'entreprise indisponible"}
      </Text>

      {/* Informations générales */}
      <View style={styles.infoSection}>
        <Text selectable={true} style={styles.sectionTitle}>Informations générales</Text>
        <Text selectable={true} style={styles.infoItem}>
          <Text style={styles.infoLabel}>Numéro d'enregistrement: </Text>
          {company.enterpriseNumber || "Non disponible"}
        </Text>
        <Text selectable={true} style={styles.infoItem}>
          <Text style={styles.infoLabel}>Forme légale: </Text>
          {company.info?.JuridicalForm || "Non disponible"}
        </Text>
        <Text selectable={true} style={styles.infoItem}>
          <Text style={styles.infoLabel}>Statut: </Text>
          {company.info?.Status || "Non disponible"}
        </Text>
        <Text selectable={true} style={styles.infoItem}>
          <Text style={styles.infoLabel}>Date de création: </Text>
          {formatDate(company.info?.StartDate)}
        </Text>
      </View>

      {/* Adresse */}
      {company.address && company.address.length > 0 && (
        <View style={styles.infoSection}>
          <Text selectable={true} style={styles.sectionTitle}>Adresse</Text>
          <Text selectable={true} style={styles.infoItem}>
            <Text style={styles.infoLabel}>Rue: </Text>
            {`${company.address[0].Street || "Non disponible"} ${
              company.address[0].HouseNumber || ""
            }`}
          </Text>
          <Text selectable={true} style={styles.infoItem}>
            <Text style={styles.infoLabel}>Commune: </Text>
            {company.address[0].Municipality || "Non disponible"}
          </Text>
          <Text selectable={true} style={styles.infoItem}>
            <Text style={styles.infoLabel}>Code Postal: </Text>
            {company.address[0].Zipcode || "Non disponible"}
          </Text>
        </View>
      )}

      {/* Activités */}
      {company.activity && company.activity.length > 0 && (
        <View style={styles.infoSection}>
          <Text selectable={true} style={styles.sectionTitle}>Activités</Text>
          {company.activity.map((act, index) => (
            <View key={index} style={styles.activityItem}>
              <Text selectable={true} style={styles.infoItem}>
                <Text style={styles.infoLabel}>Groupe d'activité: </Text>
                {act.ActivityGroup || "Non disponible"}
              </Text>
              <Text selectable={true} style={styles.infoItem}>
                <Text style={styles.infoLabel}>Version NACE: </Text>
                {act.NaceVersion || "Non disponible"}
              </Text>
              <Text selectable={true} style={styles.infoItem}>
                <Text style={styles.infoLabel}>Code NACE: </Text>
                {act.NaceCode || "Non disponible"}
              </Text>
              <Text selectable={true} style={styles.infoItem}>
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
          <Text selectable={true} style={styles.sectionTitle}>Contact</Text>
          {company.contact.map((cont, index) => (
            <View key={index}>
              {cont.ContactType === "Numéro de téléphone" && (
                <Text selectable={true} style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tél: </Text>
                  {cont.Value || "Non disponible"}
                </Text>
              )}
              {cont.ContactType === "Adresse e-mail" && (
                <Text selectable={true} style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Email: </Text>
                  {cont.Value || "Non disponible"}
                </Text>
              )}
              {cont.ContactType === "Adresse web" && (
                <Text selectable={true} style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Web: </Text>
                  {cont.Value || "Non disponible"}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Branches */}
      {company.branches && company.branches.length > 0 && (
        <View style={styles.infoSection}>
          <Text selectable={true} style={styles.sectionTitle}>Branches</Text>
          {company.branches.map((branch, index) => (
            <View key={index} style={styles.branchItem}>
              <Text selectable={true} style={styles.infoItem}>
                <Text style={styles.infoLabel}>ID de la branche: </Text>
                {branch.branchId || "Non disponible"}
              </Text>
              <Text selectable={true} style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date de début: </Text>
                {formatDate(branch.StartDate)}
              </Text>
              {branch.address && branch.address.length > 0 && (
                <>
                  <Text selectable={true} style={styles.infoLabel}>Adresse:</Text>
                  <Text selectable={true} style={styles.infoItem}>
                    {branch.address[0].Street}, {branch.address[0].HouseNumber},{" "}
                    {branch.address[0].Municipality}, {branch.address[0].Zipcode}
                  </Text>
                </>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Établissements */}
      {company.establishments && company.establishments.length > 0 && (
        <View style={styles.infoSection}>
          <Text selectable={true} style={styles.sectionTitle}>Établissements</Text>
          {company.establishments.map((establishment, index) => (
            <View key={index} style={styles.establishmentItem}>
              <Text selectable={true} style={styles.infoItem}>
                <Text style={styles.infoLabel}>Numéro d'établissement: </Text>
                {establishment.establishmentNumber || "Non disponible"}
              </Text>
              <Text selectable={true} style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date de début: </Text>
                {formatDate(establishment.StartDate)}
              </Text>
              {establishment.address && establishment.address.length > 0 && (
                <>
                  <Text selectable={true} style={styles.infoLabel}>Adresse:</Text>
                  <Text selectable={true} style={styles.infoItem}>
                    {establishment.address[0].Street},{" "}
                    {establishment.address[0].HouseNumber},{" "}
                    {establishment.address[0].Municipality},{" "}
                    {establishment.address[0].Zipcode}
                  </Text>
                </>
              )}
            </View>
          ))}
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
  activityItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  branchItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f2f2f2",
  },
  establishmentItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#e9f5ff",
  },
});
