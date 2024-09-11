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
    legalForm: "SA",
    status: "Actif",
    creationDate: "2010-01-01",
    activity: {
      ActivityGroup: "001",
      NaceVersion: "2003",
      NaceCode: "45450",
      Classification: "SECO"
    },
    address: {
      StreetFR: "Rue de Paris",
      HouseNumber: "123",
      Zipcode: "1000",
      MunicipalityFR: "Bruxelles",
    },
    denomination: {
      Denomination: "Uber Belgium",
    },
    contact: {
      ContactType: "EMAIL",
      ContactValue: "contact@uber.com"
    },
    branch: {
      address: {
        StreetFR: "Avenue Louise",
        HouseNumber: "456",
        Zipcode: "1000",
        MunicipalityFR: "Bruxelles"
      }
    }
  },
  {
    id: "2",
    name: "Uber Eats",
    registrationNumber: "654321",
    legalForm: "SRL",
    status: "Actif",
    creationDate: "2015-05-15",
    activity: {
      ActivityGroup: "001",
      NaceVersion: "2008",
      NaceCode: "56100",
      Classification: "MAIN"
    },
    address: {
      StreetFR: "Rue des Scyoux",
      HouseNumber: "20",
      Zipcode: "5361",
      MunicipalityFR: "Hamois",
    },
    denomination: {
      Denomination: "Uber Eats Belgium",
    },
    contact: {
      ContactType: "EMAIL",
      ContactValue: "contact@ubereats.com"
    },
    establishment: {
      "2.004.335.348": {
        activity: [
          {
            ActivityGroup: "006",
            NaceVersion: "2008",
            NaceCode: "36000",
            Classification: "MAIN"
          }
        ],
        address: {
          StreetFR: "Rue des Scyoux",
          HouseNumber: "20",
          Zipcode: "5361",
          MunicipalityFR: "Hamois"
        },
        denomination: {
          Denomination: "Uber Eats Establishment"
        },
        StartDate: "01-04-1949"
      }
    },
    branch: {
      address: {
        StreetFR: "Rue des Scyoux",
        HouseNumber: "20",
        Zipcode: "5361",
        MunicipalityFR: "Hamois"
      }
    }
  }
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

              {/* Adresser chaque champ de l'adresse séparément */}
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
});
