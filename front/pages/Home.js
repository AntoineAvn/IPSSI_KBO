import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  StyleSheet,
} from "react-native";
import Footer from "../components/Footer"; // Importation du Footer
import SearchBar from "../components/SearchBar"; // Importation de la SearchBar
import { Image } from "react-native";

export default function Home({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dynamicText, setDynamicText] = useState("nom de l'entreprise");

  // Animation de l'opacité et de la translation
  const fadeAnim = useRef(new Animated.Value(0)).current; // Valeur initiale de l'opacité
  const translateY = useRef(new Animated.Value(-20)).current; // Valeur initiale de la position verticale

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      Keyboard.dismiss();
      navigation.navigate("SearchResults", { query: searchQuery });
    }
  };

  // Gestion du texte dynamique et des animations qui changent toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      // Animation d'entrée pour le texte
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0, // Diminuer l'opacité avant de changer le texte
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20, // Remonter le texte avant de changer
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setDynamicText((prevText) =>
          prevText === "nom de l'entreprise" ? "N° d'entreprise" : "nom de l'entreprise"
        );

        // Animation d'entrée pour le nouveau texte
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1, // Réapparaître avec une opacité complète
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0, // Faire descendre le texte dans sa position normale
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3000); // Changement de texte toutes les 3 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle
  }, [fadeAnim, translateY]);

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
            {/* Section avec le fond coloré et les bords arrondis */}
            <View style={styles.headerBackground}>
              <View style={styles.header}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logo}
                />
                <Text style={styles.title}>Toute l'information des entreprises belges</Text>
              </View>
            </View>

            {/* Texte au milieu */}
            <View style={styles.middle}>
              <Text style={styles.searchTitle}>
                Recherchez les informations avec le
              </Text>

              {/* Texte dynamique avec animation */}
              <Animated.Text
                style={[
                  styles.highlightedText,
                  {
                    opacity: fadeAnim, // Animer l'opacité
                    transform: [{ translateY }], // Animer la translation verticale
                  },
                ]}
              >
                {dynamicText}
              </Animated.Text>

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
  headerBackground: {
    backgroundColor: "#107aca", // Couleur de fond
    borderBottomLeftRadius: 40, // Bords arrondis en bas
    borderBottomRightRadius: 40,
    paddingBottom: 20, // Ajouter un peu d'espace pour bien voir les bords arrondis
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
    color: "#fff", // Couleur du texte en blanc
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  highlightedText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 20,
  },
});
