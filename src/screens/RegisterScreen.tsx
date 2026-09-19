import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {registerUser} from '../api/authApi';
import {RootStackParamList} from '../navigation/AppNavigator';
import colors from '../constants/colors';
import spacing from '../constants/spacing';
import {moderateScale, normalizeFont} from '../utils/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen = ({navigation}: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
  // 1. Check empty fields
  if (
    !name.trim() ||
    !email.trim() ||
    !password ||
    !confirmPassword
  ) {
    Alert.alert(
      'Missing Information',
      'Please fill all fields.'
    );
    return;
  }

  // 2. Check name
  if (name.trim().length < 2) {
    Alert.alert(
      'Invalid Name',
      'Name must be at least 2 characters.'
    );
    return;
  }

  // 3. Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    Alert.alert(
      'Invalid Email',
      'Please enter a valid email address.'
    );
    return;
  }

  // 4. Check password length
  if (password.length < 6) {
    Alert.alert(
      'Weak Password',
      'Password must be at least 6 characters.'
    );
    return;
  }

  // 5. Check password match
  if (password !== confirmPassword) {
    Alert.alert(
      'Password Error',
      'Passwords do not match.'
    );
    return;
  }

  try {
    setLoading(true);

    // 6. Send data to backend
    const data = await registerUser(
      name.trim(),
      email.trim(),
      password
    );

    // 7. Backend success
    if (data.success) {
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully.',
        [
          {
            text: 'Continue',
            onPress: () => {
              navigation.replace('Login');
            },
          },
        ],
      );
    }
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      'Registration failed. Please try again.';

    Alert.alert('Registration Failed', message);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>⚡</Text>
            </View>

            <Text style={styles.appName}>
              EV Station Finder
            </Text>

            <Text style={styles.tagline}>
              Start your electric journey
            </Text>
          </View>

          {/* Register Card */}
          <View style={styles.card}>
            <Text style={styles.title}>
              Create Account
            </Text>

            <Text style={styles.subtitle}>
              Create an account to find and manage EV charging stations.
            </Text>

            {/* Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textLight}
                autoCapitalize="words"
                style={styles.input}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>

              <View style={styles.passwordWrapper}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={styles.passwordInput}
                />

                <Pressable
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }
                  hitSlop={10}>
                  <Text style={styles.showText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Confirm Password
              </Text>

              <View style={styles.passwordWrapper}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  style={styles.passwordInput}
                />

                <Pressable
                  onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  hitSlop={10}>
                  <Text style={styles.showText}>
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Register Button */}
            <Pressable
  disabled={loading}
  style={({pressed}) => [
    styles.registerButton,
    pressed && styles.buttonPressed,
    loading && {opacity: 0.6},
  ]}
  onPress={handleRegister}
>
  <Text style={styles.registerButtonText}>
    {loading ? 'Creating Account...' : 'Create Account'}
  </Text>
</Pressable>

            {/* Login */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account?
              </Text>

              <Pressable
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>
                  Login
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },

  logoCircle: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  logoText: {
    fontSize: normalizeFont(30),
  },

  appName: {
    fontSize: normalizeFont(24),
    fontWeight: '700',
    color: colors.textPrimary,
  },

  tagline: {
    marginTop: spacing.xs,
    fontSize: normalizeFont(13),
    color: colors.textSecondary,
  },

  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: moderateScale(20),
    padding: spacing.xxl,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  title: {
    fontSize: normalizeFont(24),
    fontWeight: '700',
    color: colors.textPrimary,
  },

  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
    fontSize: normalizeFont(14),
    lineHeight: normalizeFont(20),
    color: colors.textSecondary,
  },

  inputContainer: {
    marginBottom: spacing.lg,
  },

  label: {
    marginBottom: spacing.sm,
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: colors.textPrimary,
  },

  input: {
    width: '100%',
    height: moderateScale(52),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(12),
    paddingHorizontal: spacing.lg,
    fontSize: normalizeFont(15),
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },

  passwordWrapper: {
    width: '100%',
    minHeight: moderateScale(52),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(12),
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },

  passwordInput: {
    flex: 1,
    fontSize: normalizeFont(15),
    color: colors.textPrimary,
    paddingVertical: 0,
  },

  showText: {
    fontSize: normalizeFont(13),
    fontWeight: '600',
    color: colors.primary,
  },

  registerButton: {
    width: '100%',
    minHeight: moderateScale(52),
    borderRadius: moderateScale(12),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  registerButtonText: {
    fontSize: normalizeFont(16),
    fontWeight: '700',
    color: colors.white,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.xl,
  },

  loginText: {
    fontSize: normalizeFont(14),
    color: colors.textSecondary,
  },

  loginLink: {
    marginLeft: spacing.xs,
    fontSize: normalizeFont(14),
    fontWeight: '700',
    color: colors.primary,
  },
});

export default RegisterScreen;