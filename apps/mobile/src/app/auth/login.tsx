import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Lock, Mail, ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import { api, setStoredToken } from '@/services/api';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { error } = useLocalSearchParams<{ error?: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const openTerms = () => {
    WebBrowser.openBrowserAsync('https://epitometrc-web.vercel.app/terms');
  };
  const openPrivacy = () => {
    WebBrowser.openBrowserAsync('https://epitometrc-web.vercel.app/privacy');
  };

  React.useEffect(() => {
    if (error) {
      setErrorMsg(error);
    }
  }, [error]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const { status, data } = await api.auth.login({ email, password });
      
      if (status === 200 && data.success) {
        // Fetch role data
        const profileRes = await api.auth.me();
        if (profileRes.status === 200 && profileRes.data.success && profileRes.data.user) {
          const userRole = profileRes.data.user.role;
          if (userRole === 'Student') {
            router.replace('/student/dashboard');
          } else if (userRole === 'Employee' || userRole === 'Admin' || userRole === 'Employer' || userRole === 'Organization') {
            router.replace('/employee/dashboard');
          } else {
            setErrorMsg('Unauthorized profile role.');
            await setStoredToken(null);
          }
        } else {
          setErrorMsg('Failed to resolve profile details.');
          await setStoredToken(null);
        }
      } else {
        setErrorMsg(data.error || 'Invalid email or password.');
      }
    } catch {
      setErrorMsg('Network error. Failed to reach auth node.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!policyAccepted) {
      setErrorMsg('You must read and agree to the Terms & Conditions and Privacy Policy before signing in with Google.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      // 1. Fetch Google Auth URL from Vercel backend
      const response = await fetch('https://epitometrc-web.vercel.app/api/auth/oauth/url?provider=google&state=mobile');
      const payload = await response.json();
      if (!response.ok || !payload.success || !payload.url) {
        setErrorMsg('Google Sign-In is currently unavailable.');
        setLoading(false);
        return;
      }

      // 2. Open secure system browser session
      const result = await WebBrowser.openAuthSessionAsync(
        payload.url,
        'epitometrc:///auth-callback'
      );

      // 3. Process redirect result and extract token or error
      if (result.type === 'success' && result.url) {
        const tokenMatch = result.url.match(/[?&]token=([^&#]+)/);
        const errorMatch = result.url.match(/[?&]error=([^&#]+)/);
        const token = tokenMatch ? tokenMatch[1] : null;
        const errorVal = errorMatch ? decodeURIComponent(errorMatch[1]) : null;

        if (token) {
          await setStoredToken(token);
          
          // Verify profile and redirect
          const profileRes = await api.auth.me();
          if (profileRes.status === 200 && profileRes.data.success && profileRes.data.user) {
            const userRole = profileRes.data.user.role;
            if (userRole === 'Student') {
              router.replace('/student/dashboard');
            } else {
              setErrorMsg('Access Denied: Google OAuth is restricted to Student accounts.');
              await setStoredToken(null);
            }
          } else {
            setErrorMsg('Failed to resolve authenticated profile.');
            await setStoredToken(null);
          }
        } else if (errorVal) {
          setErrorMsg(errorVal);
        } else {
          setErrorMsg('Failed to acquire secure session token.');
        }
      }
    } catch {
      setErrorMsg('Google authentication network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color="#475569" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.smallLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Enter credentials to access your placement dashboard</Text>
        </View>

        {/* Error Alert */}
        {errorMsg && (
          <View style={styles.errorAlert}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Inputs */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail size={16} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={16} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? <EyeOff size={16} color="#94A3B8" /> : <Eye size={16} color="#94A3B8" />}
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link */}
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* OR Separator */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>OR</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Compliance Checkbox */}
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setPolicyAccepted(!policyAccepted)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, policyAccepted && styles.checkboxChecked]}>
              {policyAccepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              I have read and agree to the{' '}
              <Text style={styles.linkText} onPress={openTerms}>Terms &amp; Conditions</Text>
              {' '}and{' '}
              <Text style={styles.linkText} onPress={openPrivacy}>Privacy Policy</Text>.
            </Text>
          </TouchableOpacity>

          {/* Google Login Button */}
          <TouchableOpacity
            style={[styles.googleButton, (loading || !policyAccepted) && styles.disabledButton]}
            onPress={handleGoogleLogin}
            disabled={loading || !policyAccepted}
          >
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  header: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    marginTop: -40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  smallLogo: {
    height: 60,
    width: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  errorAlert: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 16,
    position: 'relative',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#0B172A',
    fontSize: 14,
    fontWeight: '600',
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#F97316',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#F97316',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.7,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 8,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  separatorText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  checkbox: {
    height: 18,
    width: 18,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#F97316',
    fontWeight: '700',
  },
});
