import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
            defaultSource={require('@/assets/images/icon.png')}
          />
          <Text style={styles.logoText}>
            Epitome<Text style={styles.orangeText}>TRC</Text>
          </Text>
        </View>

        {/* Hero Card */}
        <View style={styles.card}>
          <View style={styles.badge}>
            <Sparkles size={12} color="#F97316" />
            <Text style={styles.badgeText}>AI Career Assistant Active</Text>
          </View>
          <Text style={styles.title}>Engineer Your Future</Text>
          <Text style={styles.subtitle}>
            Optimized ATS resume scanner, dynamic learning path roadmaps, verbal AI mock interviews, and direct recruitment placement hubs.
          </Text>
        </View>

        {/* Actions Button Panel */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.primaryButtonText}>Login to Dashboard</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Epitome TRC © 2026 • Professional Placement & Training Services
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    height: 80,
    width: 80,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0B172A',
    fontFamily: 'System',
  },
  orangeText: {
    color: '#F97316',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EA580C',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F97316',
    borderRadius: 16,
    height: 52,
    gap: 8,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    height: 52,
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
