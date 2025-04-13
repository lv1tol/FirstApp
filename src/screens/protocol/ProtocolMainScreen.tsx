import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProtocolMainScreenProps } from '../../navigation/types'; // Перевірте шлях до типів

const colors = {
  background: '#f0f4f8',
  primary: '#0057b7',
  primaryText: '#ffd700',
  text: '#333',
};

const ProtocolMainScreen: React.FC<ProtocolMainScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Оформлення Європротоколу</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ParticipantA')}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Оформити Протокол</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProtocolMainScreen;