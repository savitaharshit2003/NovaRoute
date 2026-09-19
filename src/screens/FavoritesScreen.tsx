import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

const FAVORITES_KEY = '@evchargefinder_favorite_stations';

const FavoritesScreen = ({ navigation }: any) => {
  // All hooks must remain at the top level
  const [favorites, setFavorites] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const getUserLocation = useCallback(() => {
    setLoadingLocation(true);

    Geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLoadingLocation(false);
      },
      error => {
        console.log('Location error:', error.message);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.log('Error loading favorites:', error);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
    getUserLocation();

    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
      getUserLocation();
    });

    return unsubscribe;
  }, [navigation, loadFavorites, getUserLocation]);

  const calculateDistance = (
    lat1: number | string | null | undefined,
    lon1: number | string | null | undefined,
    lat2: number | string | null | undefined,
    lon2: number | string | null | undefined,
  ) => {
    if (
      lat1 == null ||
      lon1 == null ||
      lat2 == null ||
      lon2 == null
    ) {
      return null;
    }

    const latitude1 = Number(lat1);
    const longitude1 = Number(lon1);
    const latitude2 = Number(lat2);
    const longitude2 = Number(lon2);

    if (
      !Number.isFinite(latitude1) ||
      !Number.isFinite(longitude1) ||
      !Number.isFinite(latitude2) ||
      !Number.isFinite(longitude2)
    ) {
      return null;
    }

    const toRadians = (value: number) => (value * Math.PI) / 180;
    const R = 6371;

    const dLat = toRadians(latitude2 - latitude1);
    const dLon = toRadians(longitude2 - longitude1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(latitude1)) *
        Math.cos(toRadians(latitude2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const getStationCoordinates = (item: any) => {
    const latitude =
      item.latitude ??
      item.lat ??
      item.location?.latitude ??
      item.AddressInfo?.Latitude ??
      item.coordinates?.latitude;

    const longitude =
      item.longitude ??
      item.lng ??
      item.location?.longitude ??
      item.AddressInfo?.Longitude ??
      item.coordinates?.longitude;

    return {
      latitude,
      longitude,
    };
  };

  const removeFavorite = async (stationId: any) => {
    try {
      const updatedFavorites = favorites.filter(
        station => station.id !== stationId,
      );

      setFavorites(updatedFavorites);

      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites),
      );
    } catch (error) {
      console.log('Error removing favorite:', error);
    }
  };

  const confirmRemove = (stationId: any) => {
    Alert.alert(
      'Remove Favorite',
      'Do you want to remove this charging station from favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFavorite(stationId),
        },
      ],
    );
  };

  const renderStation = ({ item }: { item: any }) => {
    const coordinates = getStationCoordinates(item);

    const stationDistance = userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          coordinates.latitude,
          coordinates.longitude,
        )
      : null;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.stationName} numberOfLines={2}>
              {item.name || 'EV Charging Station'}
            </Text>

            <Text style={styles.address} numberOfLines={2}>
              {item.address || 'Address unavailable'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => confirmRemove(item.id)}
          >
            <Text style={styles.heart}>♥</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Distance</Text>

            {loadingLocation ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text style={styles.infoValue}>
                {stationDistance !== null
                  ? `${stationDistance.toFixed(1)} km`
                  : 'Distance unavailable'}
              </Text>
            )}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Status</Text>

            <Text style={styles.available}>
              {item.status || 'Available'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate('StationDetails', {
              station: item,
            })
          }
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Favorite Stations</Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>♡</Text>

          <Text style={styles.emptyTitle}>No Favorite Stations</Text>

          <Text style={styles.emptyText}>
            Save your preferred charging stations here for quick access.
          </Text>

          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>
              Explore Stations
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => String(item.id)}
          renderItem={renderStation}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
  },

  listContent: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  titleContainer: {
    flex: 1,
    paddingRight: 10,
  },

  stationName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  address: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
    lineHeight: 18,
  },

  heartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  heart: {
    fontSize: 23,
    color: '#EF4444',
  },

  infoRow: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 16,
  },

  infoBox: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  available: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
  },

  viewButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: -50,
  },

  emptyIcon: {
    fontSize: 75,
    color: '#CBD5E1',
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 25,
  },

  exploreButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 12,
  },

  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});