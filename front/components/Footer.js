import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Mon Application</Text>
      </View>
      <View style={styles.bottomBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#333',
  },
  bottomBar: {
    backgroundColor: '#000',
    height: 20,
    width: '100%',
  },
});
