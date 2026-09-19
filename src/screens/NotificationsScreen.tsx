import React, {useEffect, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_SETTINGS_KEY =
  '@evchargefinder_notification_settings';

const NotificationsScreen = () => {
  const [stationAlerts, setStationAlerts] = useState(true);
  const [nearbyAlerts, setNearbyAlerts] = useState(true);
  const [favoriteAlerts, setFavoriteAlerts] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(
        NOTIFICATION_SETTINGS_KEY,
      );

      if (saved) {
        const settings = JSON.parse(saved);

        setStationAlerts(settings.stationAlerts);
        setNearbyAlerts(settings.nearbyAlerts);
        setFavoriteAlerts(settings.favoriteAlerts);
      }
    } catch (error) {
      console.log('Notification settings error:', error);
    }
  };

  const saveSettings = async (
    station: boolean,
    nearby: boolean,
    favorite: boolean,
  ) => {
    try {
      await AsyncStorage.setItem(
        NOTIFICATION_SETTINGS_KEY,
        JSON.stringify({
          stationAlerts: station,
          nearbyAlerts: nearby,
          favoriteAlerts: favorite,
        }),
      );
    } catch (error) {
      console.log('Save notification settings error:', error);
    }
  };

  const toggleStationAlerts = (value: boolean) => {
    setStationAlerts(value);

    saveSettings(
      value,
      nearbyAlerts,
      favoriteAlerts,
    );
  };

  const toggleNearbyAlerts = (value: boolean) => {
    setNearbyAlerts(value);

    saveSettings(
      stationAlerts,
      value,
      favoriteAlerts,
    );
  };

  const toggleFavoriteAlerts = (value: boolean) => {
    setFavoriteAlerts(value);

    saveSettings(
      stationAlerts,
      nearbyAlerts,
      value,
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Notifications
      </Text>

      <Text style={styles.subtitle}>
        Manage your EV station alerts
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.rowTitle}>
              Charging Station Alerts
            </Text>

            <Text style={styles.description}>
              Get updates about charging stations
            </Text>
          </View>

          <Switch
            value={stationAlerts}
            onValueChange={toggleStationAlerts}
            trackColor={{
              false: '#CBD5E1',
              true: '#86EFAC',
            }}
            thumbColor={
              stationAlerts ? '#16A34A' : '#F8FAFC'
            }
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.rowTitle}>
              Nearby Station Alerts
            </Text>

            <Text style={styles.description}>
              Get alerts about stations near you
            </Text>
          </View>

          <Switch
            value={nearbyAlerts}
            onValueChange={toggleNearbyAlerts}
            trackColor={{
              false: '#CBD5E1',
              true: '#86EFAC',
            }}
            thumbColor={
              nearbyAlerts ? '#16A34A' : '#F8FAFC'
            }
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.rowTitle}>
              Favorite Station Alerts
            </Text>

            <Text style={styles.description}>
              Get updates about your favorite stations
            </Text>
          </View>

          <Switch
            value={favoriteAlerts}
            onValueChange={toggleFavoriteAlerts}
            trackColor={{
              false: '#CBD5E1',
              true: '#86EFAC',
            }}
            thumbColor={
              favoriteAlerts ? '#16A34A' : '#F8FAFC'
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
    paddingTop: 55,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,
  },

  row: {
    minHeight: 85,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  textContainer: {
    flex: 1,
    paddingRight: 15,
  },

  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },

  description: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
});

export default NotificationsScreen;