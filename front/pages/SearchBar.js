import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch, placeholder = "Rechercher..." }) => {
  return (
    <View style={styles.searchContainer}>
      <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
      <TextInput
        style={styles.searchBar}
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      {/* <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Icon name="search" size={20} color="#fff" />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    padding: 10,
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
});

export default SearchBar;
