import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {getProfile} from '../api/authApi';
import {useFocusEffect} from '@react-navigation/native';

const ProfileScreen = ({navigation}: any) => {
  const {user, logout} = useAuth();
  const [profile, setProfile] = useState<any>(null);
const [loading, setLoading] = useState(true);

useFocusEffect(
  useCallback(() => {
    loadProfile();
  }, []),
);

const loadProfile = async () => {
  try {
    setLoading(true);

    const data = await getProfile();

    if (data.success) {
      setProfile(data.user);
    }
  } catch (error: any) {
    console.log('Profile API error:', error);

    Alert.alert(
      'Error',
      error?.response?.data?.message ||
        'Unable to load profile',
    );
  } finally {
    setLoading(false);
  }
};

  const handleLogout = async () => {
  await logout();
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.subtitle}>Manage your EV Finder account</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
  {(profile?.name || user?.name)
    ?.charAt(0)
    .toUpperCase()}
</Text>
        </View>

        <View>
          <Text style={styles.name}>
  {profile?.name || user?.name}
</Text>

<Text style={styles.email}>
  {profile?.email || user?.email}
</Text>
        </View>
      </View>

     <TouchableOpacity
  style={styles.option}
  onPress={() =>
    navigation.getParent()?.navigate('EditProfile')
  }>
  <Text style={styles.optionText}>⚙️ Edit Profile</Text>
  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>
<TouchableOpacity
  style={styles.option}
  onPress={() =>
    navigation.getParent()?.navigate('ChangePassword')
  }>
  <Text style={styles.optionText}>
    🔐 Change Password
  </Text>
  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>

      <TouchableOpacity
  style={styles.option}
  onPress={() =>
    navigation.getParent()?.navigate('Notifications')
  }>
  <Text style={styles.optionText}>
    🔔 Notifications
  </Text>

  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>ℹ️ About EV Finder</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  header: {
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 3,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  email: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  option: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  optionText: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
  },

  arrow: {
    fontSize: 25,
    color: '#94A3B8',
  },

  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FEE2E2',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },
});