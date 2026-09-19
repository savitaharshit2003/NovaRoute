import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import colors from '../constants/colors';
import spacing from '../constants/spacing';
import {moderateScale, normalizeFont} from '../utils/responsive';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ChargingStation,
  getNearbyChargingStations,
} from '../api/chargingStationApi';

import {RootStackParamList} from '../navigation/AppNavigator';
import {getCurrentLocation} from '../services/locationService';

const AllStationsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteStations, setFavoriteStations] = useState<
    ChargingStation[]
  >([]);

  const FAVORITES_KEY = '@evchargefinder_favorite_stations';

  useEffect(() => {
    loadStations();
    loadFavorites();
  }, []);

  const loadStations = async () => {
    try {
      setLoading(true);

      const currentLocation = await getCurrentLocation();

      const nearbyStations = await getNearbyChargingStations(currentLocation);

      setStations(nearbyStations);
    } catch (error) {
      console.error('Error loading all stations:', error);
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);

        setFavoriteStations(
          Array.isArray(parsedFavorites) ? parsedFavorites : [],
        );
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
        updatedFavorites = [...currentFavorites, station];
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.title}>All Charging Stations</Text>

          <View style={styles.headerSpacer} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />

            <Text style={styles.loadingText}>
              Finding charging stations...
            </Text>
          </View>
        ) : stations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⚡</Text>

            <Text style={styles.emptyTitle}>
              No charging stations found
            </Text>

            <Text style={styles.emptyText}>
              We could not find any charging stations nearby.
            </Text>
          </View>
        ) : (
          stations.map(station => (
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

              {/* View Station */}
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },

  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    fontSize: normalizeFont(28),
    color: colors.primaryDark,
    marginTop: -3,
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: normalizeFont(20),
    fontWeight: '700',
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
  },

  headerSpacer: {
    width: moderateScale(40),
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },

  loadingText: {
    marginTop: spacing.md,
    fontSize: normalizeFont(14),
    color: colors.textSecondary,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: moderateScale(18),
    padding: spacing.xl,
  },

  emptyIcon: {
    fontSize: normalizeFont(32),
    marginBottom: spacing.sm,
  },

  emptyTitle: {
    fontSize: normalizeFont(16),
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  emptyText: {
    fontSize: normalizeFont(13),
    color: colors.textSecondary,
    textAlign: 'center',
  },

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

export default AllStationsScreen;