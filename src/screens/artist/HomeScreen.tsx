import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar
} from 'react-native';
import { artistInfo } from '../../data';
import { HomeScreenProps } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

const colors = {
  background: '#f4f4f8',
  textPrimary: '#333',
  textSecondary: '#555',
  accent: '#6200ee',
  white: '#fff',
  grey: '#ccc'
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={colors.accent} />
      <View style={styles.content}>
        <Text style={styles.artistName}>{artistInfo.name}</Text>
        <Image source={artistInfo.photo} style={styles.artistPhoto} />
        <Text style={styles.artistBio}>{artistInfo.bio}</Text>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={() => navigation.navigate('Gallery')}
          activeOpacity={0.7}
        >
          <Ionicons name="images-outline" size={20} color={colors.white} style={styles.buttonIcon} />
          <Text style={styles.galleryButtonText}>Переглянути Галерею</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  artistName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  artistPhoto: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignSelf: 'center',
    marginBottom: 25,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  artistBio: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 30,
  },
  galleryButton: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  galleryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;