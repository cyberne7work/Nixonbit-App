import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';

interface LostAndFoundItem {
  id: string;
  type: string;
  item: string;
  description: string;
  contact: string;
  image: string;
}

const LostAndFoundDetailScreen = () => {
  const { item } = useLocalSearchParams();
  const parsedItem: LostAndFoundItem = JSON.parse(item as string);

  const handleCall = () => {
    const phoneNumber = parsedItem.contact.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`).catch((err) => {
      console.error('Error opening phone dialer:', err);
      Alert.alert('Error', 'Unable to make a call. Please try again.');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>Item Details</Text>
      </View>

      {/* Item Details */}
      <View style={styles.detailsContainer}>
        <Image source={{ uri: parsedItem.image }} style={styles.itemImage} />
        <Text style={styles.typeLabel}>Type</Text>
        <Text style={styles.typeText}>{parsedItem.type}</Text>
        <Text style={styles.titleLabel}>Item</Text>
        <Text style={styles.titleText}>{parsedItem.item}</Text>
        <Text style={styles.descriptionLabel}>Description</Text>
        <Text style={styles.descriptionText}>{parsedItem.description}</Text>
        <Text style={styles.contactLabel}>Contact</Text>
        <Text style={styles.contactText}>{parsedItem.contact}</Text>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <MaterialIcons name="phone" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.callButtonText}>Call Contact</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 50,
      justifyContent: 'center',
    },
    header: {
      fontSize: 18,
      color: '#002045',
      textAlign: 'center',
      fontFamily: 'Exo-Regular',
    },
    backButton: {
      position: 'absolute',
      left: 10,
      top: '50%',
      transform: [{ translateY: -12 }],
    },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  itemImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  typeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Exo-Regular',
  },
  typeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontFamily: 'Exo-Regular',
  },
  titleLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Exo-Regular',
  },
  titleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontFamily: 'Exo-Regular',
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Exo-Regular',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontFamily: 'Exo-Regular',
  },
  contactLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Exo-Regular',
  },
  contactText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontFamily: 'Exo-Regular',
  },
  callButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Exo-Regular',
  },
});

export default LostAndFoundDetailScreen;