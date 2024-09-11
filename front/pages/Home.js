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
// import Footer from "../components/Footer"; // Importation du Footer
import SearchBar from "../components/SearchBar"; // Importation de la SearchBar
import { Image } from "react-native";

export default function Home({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dynamicText, setDynamicText] = useState("nom de l'entreprise");
  const [keyboardHeight, setKeyboardHeight] = useState(0); // Hauteur du clavier
  const scrollViewRef = useRef(null); // Référence pour scroller automatiquement

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      Keyboard.dismiss();
      navigation.navigate("SearchResults", { query: searchQuery });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setDynamicText((prevText) =>
          prevText === "nom de l'entreprise" ? "N° d'entreprise" : "nom de l'entreprise"
        );

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [fadeAnim, translateY]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height); // Capture la hauteur du clavier
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true }); // Scroller vers le bas quand le clavier s'ouvre
      }
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0); // Réinitialise la hauteur du clavier
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            paddingBottom: keyboardHeight + 100, // Ajustement manuel du padding
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <View style={styles.headerBackground}>
              <View style={styles.header}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logo}
                />
                <Text style={styles.title}>
                  Toute l'information des entreprises belges
                </Text>
              </View>
            </View>

            <View style={styles.middle}>
              <Text style={styles.searchTitle}>
                Recherchez les informations avec le
              </Text>
              <Animated.Text
                style={[
                  styles.highlightedText,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                  },
                ]}
              >
                {dynamicText}
              </Animated.Text>
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                placeholder="Rechercher une entreprise..."
              />
            </View>
          </View>
          {/* <Footer /> */}
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
    backgroundColor: "#107aca",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 20,
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
    marginTop: 30,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
    color: "#fff",
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
