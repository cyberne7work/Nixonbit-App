import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { CustomTextInput } from '@/components/CustomTextInput';
import { apiRequest } from '@/utils/api';

// Define TypeScript interfaces for taxi service data
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Car {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  lastService: string;
}

interface DriverInfo {
  name: string;
  license: string;
  phone: string;
  rating: number;
}

interface OwnerInfo {
  name: string;
  phone: string;
  email: string;
}

interface TaxiService {
  id: string;
  car: Car;
  driver: DriverInfo;
  owner: OwnerInfo;
  availability: string;
  mapLink: string;
  bookingLink: string;
  createdAt: string;
  updatedAt: string;
  currentLocation?: Coordinates | null;
}

export default function TaxiServicesScreen() {
  const router = useRouter();
  const [filterText, setFilterText] = useState<string>('');
  const [taxiServices, setTaxiServices] = useState<TaxiService[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await apiRequest('/taxi-services', 'GET', null, '');
        if ((response as any).success) {
          setTaxiServices((response as any).data.taxis);
        } else {
          Alert.alert(
            'Error',
            (response as any).message || 'Failed to fetch taxi-services.'
          );
        }
      } catch (error) {
        console.error('Error fetching taxi-services:', error);
        Alert.alert('Error', 'Failed to fetch taxi-services.');
      } finally {
        setReportsLoading(false);
      }
    })();
  }, []);

  const filteredServices = taxiServices.filter(
    (taxi) =>
      taxi.car.make.toLowerCase().includes(filterText.toLowerCase()) ||
      taxi.car.model.toLowerCase().includes(filterText.toLowerCase()) ||
      taxi.driver.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const renderServiceItem = ({ item }: { item: TaxiService }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() =>
        router.push({
          pathname: '/(root)/(services)/taxi-services-detailed-screen',
          params: {
            taxiService: JSON.stringify({
              ...item,
              car: {
                ...item.car,
                imageUrl: `https://via.placeholder.com/150/cccccc/ffffff?text=${item.car.make}+${item.car.model}`,
              },
              currentLocation: item.currentLocation || {
                latitude: 37.7749,
                longitude: -122.4194,
              },
            }),
          },
        })
      }
    >
      <Image
        source={{
          uri: `https://via.placeholder.com/150/cccccc/ffffff?text=${item.car.make}+${item.car.model}`,
        }}
        style={styles.carImage}
        resizeMode="cover"
      />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>
          {item.car.make} {item.car.model}
        </Text>
        <Text style={styles.serviceDetail}>Driver: {item.driver.name}</Text>
        <Text style={styles.serviceDetail}>
          License: {item.car.licensePlate}
        </Text>
        <Text style={styles.serviceDetail}>
          Availability: {item.availability}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>Taxi Services</Text>
      </View>

      <CustomTextInput
        label={null}
        placeholder="Filter by make, model, or driver"
        value={filterText}
        onChangeText={(text: string) => setFilterText(text)}
        autoCapitalize="none"
        style={{
          marginHorizontal: 5,
          marginVertical: 5,
        }}
      />

      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item: TaxiService) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListHeaderComponentStyle={styles.headerListStyle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    height: 40,
    justifyContent: 'center' as const,
  },
  header: {
    fontSize: 18,
    color: '#002045',
    fontWeight: 'bold' as const,
    fontFamily: 'Exo-Regular',
    textAlign: 'center' as const,
  },
  backButton: {
    position: 'absolute' as const,
    left: 10,
    top: '50%' as const,
    transform: [{ translateY: -12 }],
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  serviceItem: {
    flexDirection: 'row' as const,
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  carImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  serviceInfo: {
    flex: 1,
    justifyContent: 'center' as const,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#002045',
    fontFamily: 'Exo-Regular',
  },
  serviceDetail: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Exo-Regular',
    marginTop: 5,
  },
  headerListStyle: {
    marginBottom: 20,
  },
});