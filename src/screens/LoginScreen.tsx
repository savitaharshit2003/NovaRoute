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

import {RootStackParamList} from '../navigation/AppNavigator';
import colors from '../constants/colors';
import spacing from '../constants/spacing';
import typography from '../constants/typography';
import {moderateScale, normalizeFont} from '../utils/responsive';
import {loginUser} from '../api/authApi';
import {saveAuthData} from '../utils/authStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
  // Validation
  if (!email.trim() || !password) {
    Alert.alert(
      'Error',
      'Please enter email and password',
    );
    return;
  }

  try {
    setLoading(true);

    console.log('1. Login API starting');

    // Call backend login API
    const data = await loginUser(
      email.trim(),
      password,
    );

    console.log('2. Login API response:', data);

    // Check login success
    if (data.success) {
      console.log('3. Saving auth data');

      // Save JWT token + user data
      await saveAuthData(
        data.token,
        data.user,
      );

      console.log('4. Auth data saved');

      // Go to main application
      // navigation.replace('MainTabs');

      console.log('5. Navigation done');
    } else {
      Alert.alert(
        'Login Failed',
        data.message || 'Invalid email or password',
      );
    }
  } catch (error: any) {
    console.log('LOGIN ERROR:', error);

    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Login failed. Please try again.';

    Alert.alert(
      'Login Failed',
      message,
    );
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
          
          {/* Logo / Branding */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>⚡</Text>
            </View>

            <Text style={styles.appName}>EV Station Finder</Text>

            <Text style={styles.tagline}>
              Find. Charge. Go.
            </Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>

            <Text style={styles.subtitle}>
              Login to find nearby EV charging stations
            </Text>

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
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={styles.passwordInput}
                />

                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={10}>
                  <Text style={styles.eyeText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Forgot Password */}
            <Pressable
              style={styles.forgotButton}
              onPress={() => console.log('Forgot password')}>
              <Text style={styles.forgotText}>
                Forgot Password?
              </Text>
            </Pressable>

            {/* Login */}
            <Pressable
  disabled={loading}
  onPress={handleLogin}
  style={({pressed}) => [
    styles.loginButton,
    pressed && styles.buttonPressed,
    loading && {opacity: 0.6},
  ]}
>
  <Text style={styles.loginButtonText}>
    {loading ? 'Logging in...' : 'Login'}
  </Text>
</Pressable>

            {/* Register */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Don't have an account?
              </Text>

              <Pressable
                onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>
                  Register
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

  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },

  logoCircle: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(36),
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  logoText: {
    fontSize: normalizeFont(34),
  },

  appName: {
    fontSize: normalizeFont(26),
    fontWeight: '700',
    color: colors.textPrimary,
  },

  tagline: {
    marginTop: spacing.xs,
    fontSize: normalizeFont(14),
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

  eyeText: {
    fontSize: normalizeFont(13),
    fontWeight: '600',
    color: colors.primary,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },

  forgotText: {
    fontSize: normalizeFont(13),
    fontWeight: '600',
    color: colors.primary,
  },

  loginButton: {
    width: '100%',
    minHeight: moderateScale(52),
    borderRadius: moderateScale(12),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPressed: {
    opacity: 0.8,
  },

  loginButtonText: {
    fontSize: normalizeFont(16),
    fontWeight: '700',
    color: colors.white,
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.xl,
  },

  registerText: {
    fontSize: normalizeFont(14),
    color: colors.textSecondary,
  },

  registerLink: {
    marginLeft: spacing.xs,
    fontSize: normalizeFont(14),
    fontWeight: '700',
    color: colors.primary,
  },
});

export default LoginScreen;