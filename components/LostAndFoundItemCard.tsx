import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { apiRequest } from '@/utils/api';
import { useAuth } from '@clerk/clerk-expo';

interface LostAndFoundItem {
  id: string;
  type: string;
  item: string;
  description: string;
  contact: string;
  image: string;
}

interface LostAndFoundItemCardProps {
  item: LostAndFoundItem;
  onDelete: (id: string) => void;
  onEdit: (item: LostAndFoundItem) => void;
}

const LostAndFoundItemCard: React.FC<LostAndFoundItemCardProps> = ({
  item,
  onDelete,
  onEdit,
}) => {
  const { getToken } = useAuth();

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getToken();
              const response = await apiRequest(
                `/lost-and-found/${item.id}`,
                'DELETE',
                null,
                token
              );
              if (response.success) {
                onDelete(item.id);
                Alert.alert('Success', 'Item deleted successfully.');
              } else {
                Alert.alert(
                  'Error',
                  response.message || 'Failed to delete item.'
                );
              }
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item.');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    onEdit(item);
  };

  const handleCall = () => {
    const phoneNumber = item.contact.replace(/\s/g, ''); // Remove spaces from the contact number
    Linking.openURL(`tel:${phoneNumber}`).catch((err) => {
      console.error('Error opening phone dialer:', err);
      Alert.alert('Error', 'Unable to make a call. Please try again.');
    });
  };

  const handleViewDetails = () => {
    router.push({
      pathname: '/(root)/(services)/lost-and-found-detail-screen',
      params: { item: JSON.stringify(item) },
    });
  };

  return (
    <TouchableOpacity style={styles.itemCard} onPress={handleViewDetails}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemType}>{item.type}</Text>
        <Text style={styles.itemTitle}>{item.item}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemContact}>Contact: {item.contact}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={handleCall} style={styles.actionButton}>
          <MaterialIcons name="phone" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
          <MaterialIcons name="edit" size={20} color="#3470E4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
          <MaterialIcons name="delete" size={20} color="#FF4D4F" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  itemCard: {
    flexDirection: "row",
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center' as 'center',
  },
  itemType: {
    fontSize: 14,
    color: '#3470E4',
    marginBottom: 5,
    fontFamily: 'Exo-Regular',
  },
  itemTitle: {
    fontSize: 16,
    color: '#002045',
    fontFamily: 'Exo-Regular',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'Exo-Regular',
  },
  itemContact: {
    fontSize: 14,
    color: '#002045',
    fontFamily: 'Exo-Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 10,
    padding: 5,
  },
};

export default LostAndFoundItemCard;
