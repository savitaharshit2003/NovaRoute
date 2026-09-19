import React, {useState} from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {useAuth} from '../context/AuthContext';
import {updateProfile} from '../api/authApi';

const EditProfileScreen = ({navigation}: any) => {
  const {user, updateUser} = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert(
        'Error',
        'Name and email are required',
      );
      return;
    }

    try {
      setLoading(true);

      const data = await updateProfile(
        name.trim(),
        email.trim(),
      );

      if (data.success) {
        updateUser(data.user);
        Alert.alert(
          'Success',
          'Profile updated successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      }
    } catch (error: any) {
      console.log(
        'Update profile error:',
        error,
      );

      Alert.alert(
        'Update Failed',
        error?.response?.data?.message ||
          'Unable to update profile',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Edit Profile
      </Text>

      <Text style={styles.label}>
        Name
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        style={styles.input}
      />

      <Text style={styles.label}>
        Email
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <Pressable
        disabled={loading}
        onPress={handleUpdate}
        style={[
          styles.button,
          loading && styles.disabledButton,
        ]}>

        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            Save Changes
          </Text>
        )}

      </Pressable>

      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.cancelButton}>

        <Text style={styles.cancelText}>
          Cancel
        </Text>

      </Pressable>

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
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },

  cancelText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default EditProfileScreen;