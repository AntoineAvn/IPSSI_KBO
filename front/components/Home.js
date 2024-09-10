import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  StyleSheet,
} from "react-native";
import Footer from "../pages/Footer"; // Importation du Footer
import SearchBar from "../pages/SearchBar"; // Importation de la SearchBar
import { Image } from "react-native";

export default function Home({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      Keyboard.dismiss();
      navigation.navigate("SearchResults", { query: searchQuery });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          <View>
            {/* Logo en haut à gauche */}
            <View style={styles.header}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
              />
            </View>

            {/* Texte au milieu */}
            <View style={styles.middle}>
              <Text style={styles.title}>
                Toute l'information des entreprises belges
              </Text>

              {/* Réutilisation du composant SearchBar */}
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                placeholder="Rechercher une entreprise..."
              />
            </View>
          </View>

          {/* Footer */}
          <Footer />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  middle: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});
