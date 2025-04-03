import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CustomTextInput } from '@/components/CustomTextInput';
import { useRouter, useFocusEffect } from 'expo-router'; // Add useFocusEffect
import LostAndFoundItemCard from '@/components/LostAndFoundItemCard';
import { useAuth } from '@clerk/clerk-expo';
import { apiRequest } from '@/utils/api';

export default function LostAndFoundScreen() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const { getToken } = useAuth();

  // Fetch items from API
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await apiRequest('/lost-and-found', 'GET', null, token);
      if (response.success) {
        console.log(response.data);
        setItems(response.data.items);
      } else {
        throw new Error(response.message || 'Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to load items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete item from API
  const deleteItem = async (id) => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await apiRequest(`/lost-and-found/${id}`, 'DELETE', null, token);
      
      if (response.success) {
        setItems(items.filter((item) => item.id !== id));
        Alert.alert('Success', 'Item deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Use useFocusEffect to refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchItems();
    }, [])
  );

  const renderItem = ({ item }) => (
    <LostAndFoundItemCard
      item={item}
      onEdit={() => {
        router.push({
          pathname: '/(root)/(services)/add-lost-and-found-item',
          params: { item: JSON.stringify(item) },
        });
      }}
      onDelete={(id) => {
        Alert.alert(
          'Confirm Delete',
          'Are you sure you want to delete this item?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', onPress: () => deleteItem(id), style: 'destructive' },
          ]
        );
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>Lost and Found</Text>
      </View>

      {/* Search Input */}
      <CustomTextInput
        label={null}
        placeholder={'Search'}
        value={searchValue}
        onChangeText={setSearchValue}
        style={styles.searchInput}
        autoCapitalize="none"
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3470E4" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {/* List of Lost and Found Items */}
      <FlatList
        data={items.filter((item) =>
          item.item.toLowerCase().includes(searchValue.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.emptyText}>No items found</Text>
          ) : null
        }
        refreshing={isLoading}
        onRefresh={fetchItems}
      />

      {/* Add Item Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          router.push('/(root)/(services)/add-lost-and-found-item')
        }
        disabled={isLoading}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    color: '#002045',
    fontWeight: 'bold',
    fontFamily: 'Exo-Regular',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  searchInput: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: 80,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Exo-Regular',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
    fontSize: 16,
    fontFamily: 'Exo-Regular',
  },
  addButton: {
    backgroundColor: '#3470E4',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});