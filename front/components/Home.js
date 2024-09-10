import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Keyboard, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Footer from './Footer';

export default function Home({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      Keyboard.dismiss();
      navigation.navigate('SearchResults', { query: searchQuery });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <View>
            {/* Logo en haut à gauche */}
            <View style={styles.header}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
              />
            </View>

            {/* Texte au milieu */}
            <View style={styles.middle}>
              <Text style={styles.title}>Toute l'information des entreprises belges</Text>

              {/* Barre de recherche avec icône */}
              <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchBar}
                  placeholder="Rechercher une entreprise..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />
              </View>
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
    backgroundColor: '#fff',
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  middle: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    marginBottom: 20,
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    padding: 10,
  },
});
