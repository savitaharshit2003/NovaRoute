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

import {changePassword} from '../api/authApi';

const ChangePasswordScreen = ({navigation}: any) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        'Error',
        'New password must be at least 8 characters',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Error',
        'New password and confirm password do not match',
      );
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert(
        'Error',
        'New password must be different from current password',
      );
      return;
    }

    try {
      setLoading(true);

      const data = await changePassword(
        currentPassword,
        newPassword,
      );

      if (data.success) {
        Alert.alert(
          'Success',
          'Password changed successfully',
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
        'Change password error:',
        error,
      );

      Alert.alert(
        'Change Password Failed',
        error?.response?.data?.message ||
          'Unable to change password',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Change Password
      </Text>

      <Text style={styles.subtitle}>
        Keep your account secure with a strong password.
      </Text>

      <Text style={styles.label}>
        Current Password
      </Text>

      <TextInput
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Enter current password"
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.label}>
        New Password
      </Text>

      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter new password"
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.label}>
        Confirm New Password
      </Text>

      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm new password"
        secureTextEntry
        style={styles.input}
      />

      <Pressable
        disabled={loading}
        onPress={handleChangePassword}
        style={[
          styles.button,
          loading && styles.disabledButton,
        ]}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            Change Password
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
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
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

export default ChangePasswordScreen;