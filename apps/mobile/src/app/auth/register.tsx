import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, Mail, ChevronLeft, User, Phone, Briefcase } from 'lucide-react-native';
import { api, setStoredToken } from '@/services/api';
import * as WebBrowser from 'expo-web-browser';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [role, setRole] = useState<'Student' | 'Employee' | 'Intern'>('Student');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const openTerms = () => {
    WebBrowser.openBrowserAsync('https://epitometrc-web.vercel.app/terms');
  };
  const openPrivacy = () => {
    WebBrowser.openBrowserAsync('https://epitometrc-web.vercel.app/privacy');
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !contactNumber.trim()) {
      setErrorMsg('Please fill in all details.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Contact number validation (10 to 15 digits)
    const phoneRegex = /^[0-9+() -]{10,15}$/;
    if (!phoneRegex.test(contactNumber.trim())) {
      setErrorMsg('Please enter a valid contact number (10-15 digits).');
      return;
    }

    // Strong password validation
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setErrorMsg('Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    // Role-specific email gate validation
    if ((role === 'Employee' || role === 'Intern') && !email.toLowerCase().endsWith('@epitometrc.com')) {
      setErrorMsg('Employee/Intern registration is restricted to official @epitometrc.com accounts.');
      return;
    }

    if (!policyAccepted) {
      setErrorMsg('You must read and agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const { status, data } = await api.auth.register({
        name,
        email,
        password,
        contactNumber,
        role,
        policyAccepted: true,
      });

      if (status === 200 && data.success && data.token) {
        await setStoredToken(data.token);
        
        if (role === 'Student') {
          router.replace('/student/dashboard');
        } else {
          router.replace('/employee/dashboard');
        }
      } else {
        setErrorMsg(data.error || 'Registration failed.');
      }
    } catch {
      setErrorMsg('Network error. Failed to reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color="#475569" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.titleContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.smallLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register your credentials to join training cohorts</Text>
        </View>

        {/* Error Alert */}
        {errorMsg && (
          <View style={styles.errorAlert}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Role Toggle Selector */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleTab, role === 'Student' && styles.activeRoleTab]}
            onPress={() => setRole('Student')}
          >
            <Text style={[styles.roleTabText, role === 'Student' && styles.activeRoleTabText]}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleTab, role === 'Employee' && styles.activeRoleTab]}
            onPress={() => setRole('Employee')}
          >
            <Text style={[styles.roleTabText, role === 'Employee' && styles.activeRoleTabText]}>Employee</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleTab, role === 'Intern' && styles.activeRoleTab]}
            onPress={() => setRole('Intern')}
          >
            <Text style={[styles.roleTabText, role === 'Intern' && styles.activeRoleTabText]}>Intern</Text>
          </TouchableOpacity>
        </View>

        {/* Form Inputs */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <User size={16} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

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
            <Phone size={16} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              placeholderTextColor="#94A3B8"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={16} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Choose Password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

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

          <TouchableOpacity
            style={[styles.submitButton, (loading || !policyAccepted) && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading || !policyAccepted}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  titleContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  smallLogo: {
    height: 60,
    width: 60,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
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
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    padding: 4,
    borderRadius: 14,
    marginBottom: 24,
  },
  roleTab: {
    flex: 1,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  activeRoleTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  roleTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  activeRoleTabText: {
    color: '#0B172A',
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
  submitButton: {
    backgroundColor: '#F97316',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.7,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
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
