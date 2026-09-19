import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import colors from '../constants/colors';
import spacing from '../constants/spacing';
import {moderateScale, normalizeFont} from '../utils/responsive';
import {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'StationDetails'
>;

const StationDetailsScreen = ({navigation, route}: Props) => {
  const {station} = route.params;

  const openGoogleMaps = async () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open Google Maps.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open map location.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Station Details</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.stationIconContainer}>
            <Text style={styles.stationIcon}>⚡</Text>
          </View>

          <Text style={styles.stationName}>
            {station.name}
          </Text>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />

            <Text style={styles.statusText}>
              {station.status}
            </Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Location
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>📍</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Address
              </Text>

              <Text style={styles.infoValue}>
                {station.address || 'Address unavailable'}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>🧭</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Distance
              </Text>

              <Text style={styles.infoValue}>
                {station.distance}
              </Text>
            </View>
          </View>
        </View>

        {/* Charging Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Charging Information
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>⚡</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Charging Power
              </Text>

              <Text style={styles.infoValue}>
                {station.power}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>🔌</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Connector Type
              </Text>

              <Text style={styles.infoValue}>
                {station.connector}
              </Text>
            </View>
          </View>
        </View>

        {/* Coordinates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Coordinates
          </Text>

          <View style={styles.coordinatesCard}>
            <View style={styles.coordinateItem}>
              <Text style={styles.coordinateLabel}>
                Latitude
              </Text>

              <Text style={styles.coordinateValue}>
                {station.latitude.toFixed(6)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.coordinateItem}>
              <Text style={styles.coordinateLabel}>
                Longitude
              </Text>

              <Text style={styles.coordinateValue}>
                {station.longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        </View>

        {/* Google Maps */}
        <TouchableOpacity
          style={styles.mapButton}
          onPress={openGoogleMaps}
          activeOpacity={0.8}>

          <Text style={styles.mapButtonIcon}>
            🗺️
          </Text>

          <Text style={styles.mapButtonText}>
            Open in Google Maps
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default StationDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backButton: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    fontSize: normalizeFont(32),
    color: colors.textPrimary,
    lineHeight: normalizeFont(32),
    marginTop: moderateScale(-4),
  },

  headerTitle: {
    fontSize: normalizeFont(18),
    fontWeight: '700',
    color: colors.textPrimary,
  },

  headerPlaceholder: {
    width: moderateScale(42),
  },

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },

  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: moderateScale(20),
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },

  stationIconContainer: {
    width: moderateScale(76),
    height: moderateScale(76),
    borderRadius: moderateScale(38),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  stationIcon: {
    fontSize: normalizeFont(34),
  },

  stationName: {
    fontSize: normalizeFont(22),
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: normalizeFont(29),
    marginBottom: spacing.md,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: moderateScale(20),
  },

  statusDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#22C55E',
    marginRight: spacing.xs,
  },

  statusText: {
    fontSize: normalizeFont(13),
    fontWeight: '600',
    color: colors.textSecondary,
  },

  section: {
    marginBottom: spacing.xl,
  },

  sectionTitle: {
    fontSize: normalizeFont(18),
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: moderateScale(14),
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoIconContainer: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(12),
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  infoIcon: {
    fontSize: normalizeFont(20),
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: normalizeFont(12),
    color: colors.textSecondary,
    marginBottom: moderateScale(4),
  },

  infoValue: {
    fontSize: normalizeFont(15),
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: normalizeFont(21),
  },

  coordinatesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: moderateScale(14),
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  coordinateItem: {
    flex: 1,
  },

  coordinateLabel: {
    fontSize: normalizeFont(12),
    color: colors.textSecondary,
    marginBottom: moderateScale(6),
  },

  coordinateValue: {
    fontSize: normalizeFont(14),
    fontWeight: '700',
    color: colors.textPrimary,
  },

  divider: {
    width: 1,
    height: moderateScale(45),
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },

  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: moderateScale(14),
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },

  mapButtonIcon: {
    fontSize: normalizeFont(18),
    marginRight: spacing.sm,
  },

  mapButtonText: {
    fontSize: normalizeFont(16),
    fontWeight: '800',
    color: colors.white,
  },
});