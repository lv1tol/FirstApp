import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { paintings, Painting } from '../../data';
import { GalleryScreenProps } from '../../navigation/types';

const colors = {
  background: '#e8eaf6',
  cardBackground: '#fff',
  textPrimary: '#333',
  shadowColor: '#000',
};

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const totalSpacing = 15 * (numColumns + 1);
const itemWidth = (screenWidth - totalSpacing) / numColumns;

const GalleryScreen: React.FC<GalleryScreenProps> = () => {

  const renderPainting = ({ item }: { item: Painting }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.paintingImage} />
      <Text style={styles.paintingTitle} numberOfLines={2}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={paintings}
        renderItem={renderPainting}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    margin: 7.5,
    width: itemWidth,
    padding: 10,
    alignItems: 'center',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  paintingImage: {
    width: itemWidth - 20,
    height: itemWidth - 20,
    resizeMode: 'cover',
    borderRadius: 6,
    marginBottom: 8,
  },
  paintingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});

export default GalleryScreen;