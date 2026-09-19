import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import colors from '../constants/colors';
import spacing from '../constants/spacing';
import {moderateScale, normalizeFont} from '../utils/responsive';
import {getCurrentLocation} from '../services/locationService';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../navigation/AppNavigator';
import {
  getNearbyChargingStations,
  ChargingStation,
} from '../api/chargingStationApi';
import MapViewComponent from '../components/MapViewComponent';

const HomeScreen = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  } | null>(null);

  const [locationLoading, setLocationLoading] = useState(true);
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Nearby');
  const [favoriteStations, setFavoriteStations] = useState<ChargingStation[]>(
    [],
  );
  const [stationsLoading, setStationsLoading] = useState(false);

  const FAVORITES_KEY = '@evchargefinder_favorite_stations';

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadFavoriteStations();
  }, []);

  const loadFavoriteStations = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);

        setFavoriteStations(
          Array.isArray(parsedFavorites) ? parsedFavorites : [],
        );
      } else {
        setFavoriteStations([]);
      }
    } catch (error) {
      console.log('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (station: ChargingStation) => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

      const currentFavorites = storedFavorites
        ? JSON.parse(storedFavorites)
        : [];

      const isAlreadyFavorite = currentFavorites.some(
        (item: ChargingStation) => item.id === station.id,
      );

      let updatedFavorites;

      if (isAlreadyFavorite) {
        updatedFavorites = currentFavorites.filter(
          (item: ChargingStation) => item.id !== station.id,
        );
      } else {
        const stationToSave = {
          ...station,
          distance:
            typeof station.distance === 'number' &&
            !isNaN(station.distance)
              ? station.distance
              : null,
        };

        updatedFavorites = [...currentFavorites, stationToSave];
      }

      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites),
      );

      setFavoriteStations(updatedFavorites);
    } catch (error) {
      console.log('Favorite error:', error);
    }
  };

  const filteredStations = stations
    .filter(station => {
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        station.name.toLowerCase().includes(query) ||
        station.address.toLowerCase().includes(query) ||
        station.connector.toLowerCase().includes(query) ||
        station.power.toLowerCase().includes(query);

      const matchesFilter =
        activeFilter === 'Nearby'
          ? true
          : activeFilter === 'Fast Charging'
          ? parseFloat(station.power) >= 50
          : station.status.toLowerCase().includes('available') ||
            station.status.toLowerCase().includes('operational');

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const distanceA = parseFloat(a.distance);
      const distanceB = parseFloat(b.distance);

      return distanceA - distanceB;
    });

  const loadLocationAndStations = async () => {
    try {
      setLocationLoading(true);
      setStationsLoading(true);

      const currentLocation = await getCurrentLocation();

      setLocation(currentLocation);

      const nearbyStations = await getNearbyChargingStations(currentLocation);

      setStations(nearbyStations);
    } catch (error) {
      console.error('Location or station error:', error);
      setStations([]);
    } finally {
      setLocationLoading(false);
      setStationsLoading(false);
    }
  };

  useEffect(() => {
    loadLocationAndStations();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavoriteStations();
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Welcome Back 👋</Text>
            <Text style={styles.title}>EVChargeFinder</Text>
          </View>

          {/* <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Favorites')}
            activeOpacity={0.7}>
            <Text style={styles.profileText}>♥</Text>
          </TouchableOpacity> */}
        </View>

        {/* Location Card */}
        <View style={styles.locationCard}>
          <View style={styles.locationIconContainer}>
            <Text style={styles.locationIcon}>📍</Text>
          </View>

          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Your Location</Text>

            {locationLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                />

                <Text style={styles.locationText}>
                  Detecting your location...
                </Text>
              </View>
            ) : (
              <Text style={styles.locationText} numberOfLines={1}>
                {location
                  ? location.state
                    ? `${location.city}, ${location.state}`
                    : location.city
                  : 'Location unavailable'}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadLocationAndStations}
            disabled={locationLoading || stationsLoading}
            activeOpacity={0.7}>
            {locationLoading || stationsLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
              />
            ) : (
              <Text style={styles.refreshIcon}>↻</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Map */}
        {location && (
          <View style={styles.mapWrapper}>
            <MapViewComponent
              latitude={location.latitude}
              longitude={location.longitude}
              stations={stations}
            />
          </View>
        )}

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search charging stations"
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Quick Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}>
          <TouchableOpacity
            style={
              activeFilter === 'Nearby'
                ? styles.filterButtonActive
                : styles.filterButton
            }
            onPress={() => setActiveFilter('Nearby')}>
            <Text
              style={
                activeFilter === 'Nearby'
                  ? styles.filterTextActive
                  : styles.filterText
              }>
              Nearby
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              activeFilter === 'Fast Charging'
                ? styles.filterButtonActive
                : styles.filterButton
            }
            onPress={() => setActiveFilter('Fast Charging')}>
            <Text
              style={
                activeFilter === 'Fast Charging'
                  ? styles.filterTextActive
                  : styles.filterText
              }>
              ⚡ Fast Charging
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              activeFilter === 'Available'
                ? styles.filterButtonActive
                : styles.filterButton
            }
            onPress={() => setActiveFilter('Available')}>
            <Text
              style={
                activeFilter === 'Available'
                  ? styles.filterTextActive
                  : styles.filterText
              }>
              ✓ Available
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Nearby Stations Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeFilter === 'Nearby'
              ? 'Nearest Stations'
              : activeFilter}
          </Text>

          <TouchableOpacity
  activeOpacity={0.7}
  onPress={() => navigation.navigate('AllStations')}>
  <Text style={styles.viewAllText}>View All</Text>
</TouchableOpacity>
        </View>

        {/* Loading Stations */}
        {stationsLoading ? (
          <View style={styles.loadingStations}>
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />

            <Text style={styles.loadingStationsText}>
              Finding nearby charging stations...
            </Text>
          </View>
        ) : filteredStations.length === 0 ? (
          /* Empty Stations */
          <View style={styles.emptyStations}>
            <Text style={styles.emptyStationsIcon}>⚡</Text>

            <Text style={styles.emptyStationsTitle}>
              {searchQuery || activeFilter !== 'Nearby'
                ? 'No matching stations found'
                : 'No charging stations found'}
            </Text>

            <Text style={styles.emptyStationsText}>
              {searchQuery || activeFilter !== 'Nearby'
                ? 'Try changing your search or selecting another filter.'
                : 'We could not find charging stations nearby.'}
            </Text>
          </View>
        ) : (
          /* Real Station Cards */
          filteredStations.map(station => (
            <View key={station.id} style={styles.stationCard}>
              {/* Station Header */}
              <View style={styles.stationHeader}>
                <View style={styles.stationIconContainer}>
                  <Text style={styles.stationIcon}>⚡</Text>
                </View>

                <View style={styles.stationMainInfo}>
                  <Text style={styles.stationName} numberOfLines={1}>
                    {station.name}
                  </Text>

                  <Text style={styles.stationAddress} numberOfLines={2}>
                    {station.address || 'Address unavailable'}
                  </Text>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {station.status}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(station)}
                  activeOpacity={0.7}>
                  <Text style={styles.favoriteIcon}>
                    {favoriteStations.some(
                      item => String(item.id) === String(station.id),
                    )
                      ? '♥'
                      : '♡'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Station Details */}
              <View style={styles.stationDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>📍</Text>

                  <Text style={styles.detailText}>
                    {station.distance}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>⚡</Text>

                  <Text style={styles.detailText}>
                    {station.power}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>🔌</Text>

                  <Text style={styles.detailText} numberOfLines={1}>
                    {station.connector}
                  </Text>
                </View>
              </View>

              {/* View Station Button */}
              <TouchableOpacity
                style={styles.stationButton}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('StationDetails', {
                    station,
                  })
                }>
                <Text style={styles.stationButtonText}>
                  View Station
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },

  headerTextContainer: {
    flex: 1,
  },

  greeting: {
    fontSize: normalizeFont(14),
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },

  title: {
    fontSize: normalizeFont(24),
    fontWeight: '700',
    color: colors.textPrimary,
  },

  profileButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },

  profileText: {
    fontSize: normalizeFont(20),
  },

  // Location
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: moderateScale(16),
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  locationIconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  locationIcon: {
    fontSize: normalizeFont(20),
  },

  locationInfo: {
    flex: 1,
  },

  locationLabel: {
    fontSize: normalizeFont(12),
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },

  locationText: {
    fontSize: normalizeFont(16),
    fontWeight: '600',
    color: colors.textPrimary,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Map
  mapWrapper: {
    marginBottom: spacing.lg,
    borderRadius: moderateScale(18),
    overflow: 'hidden',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: moderateScale(14),
    paddingHorizontal: spacing.lg,
    height: moderateScale(52),
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  searchIcon: {
    fontSize: normalizeFont(18),
    marginRight: spacing.md,
  },

  searchInput: {
    flex: 1,
    fontSize: normalizeFont(15),
    color: colors.textPrimary,
  },

  // Filters
  filterContainer: {
    paddingBottom: spacing.xl,
  },

  filterButtonActive: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: moderateScale(22),
    marginRight: spacing.sm,
  },

  filterButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: moderateScale(22),
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterTextActive: {
    color: colors.white,
    fontSize: normalizeFont(14),
    fontWeight: '600',
  },

  filterText: {
    color: colors.textSecondary,
    fontSize: normalizeFont(14),
    fontWeight: '500',
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  sectionTitle: {
    fontSize: normalizeFont(20),
    fontWeight: '700',
    color: colors.textPrimary,
  },

  viewAllText: {
    fontSize: normalizeFont(14),
    color: colors.primary,
    fontWeight: '600',
  },

  // Loading Stations
  loadingStations: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },

  loadingStationsText: {
    marginTop: spacing.md,
    fontSize: normalizeFont(14),
    color: colors.textSecondary,
  },

  // Empty Stations
  emptyStations: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: moderateScale(18),
    padding: spacing.xl,
  },

  emptyStationsIcon: {
    fontSize: normalizeFont(32),
    marginBottom: spacing.sm,
  },

  emptyStationsTitle: {
    fontSize: normalizeFont(16),
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  emptyStationsText: {
    fontSize: normalizeFont(13),
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Station Card
  stationCard: {
    backgroundColor: colors.surface,
    borderRadius: moderateScale(18),
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  stationIconContainer: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(12),
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  stationIcon: {
    fontSize: normalizeFont(21),
  },

  stationMainInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },

  stationName: {
    fontSize: normalizeFont(16),
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  stationAddress: {
    fontSize: normalizeFont(13),
    color: colors.textSecondary,
  },

  statusBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: moderateScale(10),
    maxWidth: moderateScale(75),
  },

  statusText: {
    fontSize: normalizeFont(11),
    fontWeight: '600',
    color: colors.primaryDark,
  },

  // Station Details
  stationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  detailIcon: {
    fontSize: normalizeFont(14),
    marginRight: spacing.xs,
  },

  detailText: {
    fontSize: normalizeFont(12),
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Button
  stationButton: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    height: moderateScale(44),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },

  stationButtonText: {
    color: colors.white,
    fontSize: normalizeFont(14),
    fontWeight: '700',
  },

  refreshButton: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },

  refreshIcon: {
    fontSize: normalizeFont(24),
    color: colors.primaryDark,
    fontWeight: '700',
  },

  favoriteButton: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(17),
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },

  favoriteIcon: {
    fontSize: normalizeFont(22),
    color: colors.primary,
  },
});

export default HomeScreen;