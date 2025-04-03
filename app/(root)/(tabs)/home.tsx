import { CustomTextInput } from '@/components/CustomTextInput';
import EventCard from '@/components/EventCard';
import ImageSlider from '@/components/ImageSlider';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  Image,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiRequest } from '@/utils/api';
import { formatTimestamp } from '@/utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth, useUser } from '@clerk/clerk-expo'; // Import useAuth

// Define TypeScript interfaces
interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  date?: string;
  content?: string;
  city: string;
  category: string;
  publicationDate?: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  postedBy?: string | null;
}

interface NoticeItem {
  id: string;
  title: string;
  description: string;
  city: string;
  postedBy: string | null;
  category: string;
  isActive: boolean;
  expiryDate: string;
  createdAt: string;
}

interface ServiceItem {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  availability: boolean;
  average_rating?: number;
  views?: number;
  createdAt?: string;
  profile_picture?: string;
}

interface ServiceProvider {
  id: string;
  name: string;
  profile_picture?: string;
  services: string[]; // Adjusted to match API response (array of service names)
  average_rating?: number;
  availability: string; // e.g., "Available" or "Busy"
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface AdvertisementItem {
  id: string;
  title: string;
  description: string;
  city: string;
  category: string;
  isActive: string;
  expiryDate: string;
  price: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  link: string;
}

interface TrendingItem {
  id: string;
  type: string; // 'service', 'advertisement', 'news', 'notice'
  city: string;
  title: string;
  views: number;
  createdAt: string;
  rating?: number;
  description?: string;
  imageUrl?: string;
  category?: string;
  content?: string;
  isPublished?: boolean;
  publicationDate?: string;
  postedBy?: string | null;
}

const publicImageUrls = [
  'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  'https://images.unsplash.com/photo-1532619187604-47191f8a3b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  'https://images.unsplash.com/photo-1528799636145-dfd4f7d5a3d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
];

export default function HomeScreen() {
  const { getToken } = useAuth(); // Use Clerk's useAuth hook
  const [searchValue, setSearchValue] = useState('');
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [advertisements, setAdvertisements] = useState<AdvertisementItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [featuredServices, setFeaturedServices] = useState<ServiceProvider[]>(
    []
  );
  const { user, isSignedIn } = useUser(); // Get user details
  const { resource } = useLocalSearchParams();
  const parsedResource = resource ? JSON.parse(resource as string) : null;
  console.log('Parsed resource:', parsedResource);
  console.log('signIn:', parsedResource?.signIn);
  console.log('signUp:', parsedResource?.signUp);
  console.log('User:', user?.fullName);

  // Run checkUser only when signIn or signUp is true and user exists
  useEffect(() => {
    if (user && (parsedResource?.signIn || parsedResource?.signUp)) {
      checkUser(user);
    }
  }, [user, parsedResource]); // Depend on user and parsedResource

  const checkUser = async (user: any) => {
    try {
      console.log("User information:", user);
      if (!user) return;

      console.log('Checking user:', user.id);
      const User = {
        userId: user.id,
        name: user.fullName,
        email: user.emailAddresses[0].emailAddress,
        phone: user.phoneNumber || '1234567899',
        address: user.address || 'some address which is not in the database',
        profilePic: user.profileImageUrl || 'https://via.placeholder.com/300x200',
        city: user.city || 'Motihari',
        bio: user.bio || 'some good stuff ',
      };
      const token = await getToken();
      console.log('User:', User);

      if (parsedResource?.signIn) {
        console.log("Doing sign in");
        const response = await apiRequest(
          `/nixonbit/users/${User.userId}`,
          'PUT',
          User,
          token
        );
        console.log('User updated:', response);
      } else if (parsedResource?.signUp) {
        console.log("Doing sign up");
        const response = await apiRequest(
          '/nixonbit/users/register',
          'POST',
          User,
          token
        );
        console.log('User registered:', response);
      }
    } catch (error) {
      console.error('Error processing user:', error);
    }
  };

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken(); // Fetch the token inside the component
        // Fetch Notices
        const noticesResponse = await apiRequest(
          '/notices/city/Motihari',
          'GET',
          null,
          token
        );
        const noticesData = noticesResponse.data.notices;
        setNotices(noticesData.slice(0, 5));

        // Fetch Advertisements
        const adsResponse = await apiRequest(
          '/advertisements/city/Motihari',
          'GET',
          null
        );
        const adsData = adsResponse.data.advertisements;
        setAdvertisements(adsData.slice(0, 15));

        // Fetch News
        const newsResponse = await apiRequest(
          '/news/city/Motihari',
          'GET',
          null
        );
        const newsData = newsResponse.data.news;
        setNews(newsData.slice(0, 5));

        // Fetch Trending
        const trendingResponse = await apiRequest(
          '/trending/Motihari?limit=10&type=all',
          'GET',
          null
        );
        const trendingData = trendingResponse.data.items;
        setTrending(trendingData);

        // Fetch Featured Services
        const featuredResponse = await apiRequest(
          '/services/featured/Motihari?limit=9',
          'GET',
          null
        );
        setFeaturedServices(featuredResponse.data);
      } catch (error) {
        console.error('[ERROR]: Failed to fetch data:', error);
        Alert.alert('Error', 'Failed to load data from the server.');
      }
    };

    fetchData();
  }, []);

  const handleTrendingPress = (item: TrendingItem) => {
    switch (item.type) {
      case 'service':
        router.push({
          pathname: '/(root)/(services)/service-detailed-screen',
          params: { serviceId: item.id },
        });
        break;
      case 'advertisement':
        Linking.openURL(item.link || 'https://example.com').catch((err) =>
          Alert.alert('Error', 'Failed to open link: ' + err.message)
        );
        break;
      case 'news':
        const newsItem: NewsItem = {
          id: item.id,
          headline: item.title,
          content: item.content || '',
          city: item.city,
          category: item.category || '',
          imageUrl: item.imageUrl,
          isPublished: item.isPublished ?? true,
          publicationDate: item.publicationDate || item.createdAt,
          postedBy: item.postedBy || 'Nixonbit',
          createdAt: item.createdAt,
          updatedAt: item.createdAt,
        };
        router.push({
          pathname: '/(root)/(services)/news-detailed-screen',
          params: { news: JSON.stringify(newsItem) },
        });
        break;
      case 'notice':
        const noticeItem: NoticeItem = {
          id: item.id,
          title: item.title,
          description: item.description || '',
          city: item.city,
          postedBy: item.postedBy || 'Nixonbit',
          category: item.category || 'General',
          isActive: true,
          expiryDate: item.createdAt,
          createdAt: item.createdAt,
        };
        router.push({
          pathname: '/(root)/(services)/notice-detailed-screen',
          params: { notice: JSON.stringify(noticeItem) },
        });
        break;
      default:
        Alert.alert('Item Selected', `Trending ${item.type}: ${item.title}`);
    }
  };

  const handleAdPress = (link: string) => {
    Linking.openURL(link).catch((err) =>
      Alert.alert('Error', 'Failed to open link: ' + err.message)
    );
  };

  const handleServicePress = (item: any) => {
    const newItem = {
      id: item.id,
      profilePic: item.profile_picture,
      description: item.description || '',
      price: item.price,
      rating: item.average_rating,
      experience: item.experience,
      services: item.services,
      name: item.name,
      category: item.category,
      isActive: item.isActive,
      availability: item.availability,
      average_rating: item.average_rating || 0,
      views: item.views || 0,
      createdAt: item.createdAt || '',
      phoneNumber: item.phone || '',
    };
    router.push({
      pathname: '/(root)/(services)/servicelist-detail-screen',
      params: { item: JSON.stringify(newItem) },
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#F0F2F5', flex: 1 }}>
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View>
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.mainHeader}>
                  Welcome to <Text style={{ color: '#3470E4' }}>NixonBit!</Text>
                </Text>
                <Image
                  source={require('../../../assets/images/nixonbiticon.png')}
                  style={styles.logo}
                />
              </View>
              <Text style={styles.description}>
                Discover your city, all in one place!
              </Text>
            </View>

            {/* Search Bar */}
            <CustomTextInput
              label={null}
              placeholder={'Search'}
              value={searchValue}
              onChangeText={setSearchValue}
              style={styles.search}
              autoCapitalize="none"
            />

            {/* Notice Board Section */}
            <View>
              <View style={styles.headerButton}>
                <Text style={styles.header}>Notice Board</Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push('/(root)/(services)/notice-list-screen')
                  }
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                data={notices}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.noticeCard}
                    onPress={() =>
                      router.push({
                        pathname: '/(root)/(services)/notice-detailed-screen',
                        params: { notice: JSON.stringify(item) },
                      })
                    }
                  >
                    <Text style={styles.noticeTitle}>{item.title}</Text>
                    <Text style={styles.noticeContent}>{item.category}</Text>
                    <Text style={styles.noticeDate}>
                      {formatTimestamp(item.createdAt)}
                    </Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No notices available</Text>
                }
              />
            </View>

            {/* Advertisements Section */}
            <View>
              <Text style={styles.header}>Advertisements</Text>
              <FlatList
                horizontal
                data={advertisements}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.adCard}
                    onPress={() => handleAdPress(item.link)}
                  >
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.adImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.adTitle}>{item.title}</Text>
                    <Text style={styles.noticeContent}>{item.category}</Text>
                    <Text style={styles.noticeDate}>
                      {formatTimestamp(item.createdAt)}
                    </Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    No advertisements available
                  </Text>
                }
              />
            </View>

            {/* News Section */}
            <View>
              <View style={styles.headerButton}>
                <Text style={styles.header}>Latest News</Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push('/(root)/(services)/news-list-screen')
                  }
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                data={news}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.newsCard}
                    onPress={() =>
                      router.push({
                        pathname: '/(root)/(services)/news-detailed-screen',
                        params: { news: JSON.stringify(item) },
                      })
                    }
                  >
                    <Text style={styles.newsHeadline}>
                      {item.headline?.slice(0, 50)}
                    </Text>
                    <Text style={styles.newsSummary}>
                      {item.content?.slice(0, 50)}
                    </Text>
                    <Text style={styles.newsSource}>{item.category}</Text>
                    <Text style={styles.noticeDate}>
                      {formatTimestamp(item.createdAt)}
                    </Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No news available</Text>
                }
              />
            </View>

            {/* Trending in City Section */}
            <View>
              <Text style={styles.header}>Trending in City</Text>
              <FlatList
                horizontal
                data={trending}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <EventCard
                    eventTitle={item.title}
                    location={item.city}
                    type={item.type}
                    image={
                      item.imageUrl || 'https://via.placeholder.com/300x200'
                    }
                    onPress={() => handleTrendingPress(item)}
                  />
                )}
                pagingEnabled
                snapToAlignment="center"
                snapToInterval={300}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 20 }}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    No trending items available
                  </Text>
                }
              />
            </View>

            {/* Featured Services Section */}
            <View>
              <View style={styles.headerButton}>
                <Text style={styles.header}>Featured Services</Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push('/(root)/(services)/servicelist-screen')
                  }
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                data={showAll ? featuredServices : featuredServices.slice(0, 6)}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.serviceCard}
                    onPress={() => handleServicePress(item)}
                  >
                    {item.profile_picture ? (
                      <Image
                        source={{ uri: item.profile_picture }}
                        style={styles.profilePic}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.profilePic, styles.placeholderPic]}>
                        <MaterialIcons name="person" size={40} color="#666" />
                      </View>
                    )}
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.servicesText}>
                      Services: {item.services?.join(', ') || 'N/A'}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <MaterialIcons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>
                        {item.average_rating?.toFixed(1) || 'No rating'}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.availabilityText,
                        {
                          color:
                            item.availability === 'Available'
                              ? '#28A745'
                              : '#DC3545',
                        },
                      ]}
                    >
                      {item.availability || 'Unknown'}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No services available</Text>
                }
              />
            </View>
          </View>
        }
        ListFooterComponent={
          <View>
            <View>
              <Text style={styles.header}>City Gallery</Text>
              <ImageSlider images={publicImageUrls} />
            </View>
          </View>
        }
        ListFooterComponentStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainHeader: {
    fontSize: 24,
    fontFamily: 'Exo-Bold',
    color: '#002045',
  },
  description: {
    fontFamily: 'Exo-Regular',
    lineHeight: 24,
    color: '#002045',
  },
  header: {
    fontSize: 17,
    fontFamily: 'Exo-Bold',
    marginBottom: 15,
    marginLeft: 5,
    color: '#002045',
  },
  search: {
    marginHorizontal: 5,
    marginBottom: 15,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  headerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  viewAllButton: {
    alignSelf: 'flex-end',
    borderRadius: 4,
    marginRight: 5,
  },
  viewAllText: {
    color: '#3470E4',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Exo-Bold',
  },
  listContent: {
    paddingHorizontal: 8,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  // Notice Board Styles
  noticeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: '#3470E4',
    marginBottom: 10,
  },
  noticeTitle: {
    fontSize: 16,
    fontFamily: 'Exo-Bold',
    color: '#002045',
    marginBottom: 5,
  },
  noticeContent: {
    fontSize: 14,
    fontFamily: 'Exo-Regular',
    color: '#666',
  },
  noticeDate: {
    fontSize: 12,
    fontFamily: 'Exo-Regular',
    color: '#3470E4',
    marginTop: 5,
  },
  // Advertisement Styles
  adCard: {
    marginRight: 10,
    width: 300,
    marginBottom: 10,
  },
  adImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
    borderColor: '#002045',
  },
  adTitle: {
    fontSize: 14,
    fontFamily: 'Exo-Bold',
    color: '#3470E4',
  },
  // News Styles
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    width: 250,
    height: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: '#002045',
    marginBottom: 10,
  },
  newsHeadline: {
    fontSize: 16,
    fontFamily: 'Exo-Bold',
    color: '#002045',
    marginBottom: 5,
  },
  newsSummary: {
    fontSize: 14,
    fontFamily: 'Exo-Regular',
    color: '#666',
  },
  newsSource: {
    fontSize: 12,
    fontFamily: 'Exo-Regular',
    color: '#3470E4',
    marginTop: 5,
  },
  // Service Card Styles
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 4,
    width: 130, // Adjusted for 3 columns
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  placeholderPic: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontFamily: 'Exo-Bold',
    color: '#002045',
    marginBottom: 3,
    textAlign: 'center',
  },
  servicesText: {
    fontSize: 12,
    fontFamily: 'Exo-Regular',
    color: '#666',
    marginBottom: 3,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Exo-Regular',
    color: '#666',
    marginLeft: 3,
  },
  availabilityText: {
    fontSize: 12,
    fontFamily: 'Exo-Regular',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Exo-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
