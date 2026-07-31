import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Sparkles, BrainCircuit, Briefcase, GraduationCap } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');
const HAS_LAUNCHED_KEY = 'has_launched_onboarding';

const ONBOARDING_DATA = [
  {
    title: 'AI Career Copilot',
    description: 'Get personalized career guidance with our advanced AI assistant to help you navigate your professional journey.',
    icon: <BrainCircuit size={100} color="#F97316" />,
  },
  {
    title: 'Placement Assistance',
    description: 'Direct connections with top recruiters and dedicated placement support to land your dream job.',
    icon: <Briefcase size={100} color="#3B82F6" />,
  },
  {
    title: 'Corporate Training',
    description: 'Industry-standard training programs designed to upskill and make you enterprise-ready from day one.',
    icon: <GraduationCap size={100} color="#10B981" />,
  }
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    async function checkFirstLaunch() {
      try {
        let hasLaunched = null;
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined') {
            hasLaunched = window.localStorage.getItem(HAS_LAUNCHED_KEY);
          }
        } else {
          hasLaunched = await SecureStore.getItemAsync(HAS_LAUNCHED_KEY);
        }

        if (hasLaunched === 'true') {
          setIsFirstLaunch(false);
        } else {
          setIsFirstLaunch(true);
        }
      } catch (error) {
        setIsFirstLaunch(true);
      }
    }
    checkFirstLaunch();
  }, []);

  const completeOnboarding = async () => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(HAS_LAUNCHED_KEY, 'true');
        }
      } else {
        await SecureStore.setItemAsync(HAS_LAUNCHED_KEY, 'true');
      }
      setIsFirstLaunch(false);
      router.push('/auth/login');
    } catch (error) {
      // Proceed even if storage fails
      setIsFirstLaunch(false);
      router.push('/auth/login');
    }
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const goToNextSlide = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (currentIndex + 1), animated: true });
    } else {
      completeOnboarding();
    }
  };

  if (isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0b172a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (isFirstLaunch) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.skipContainer}>
          <TouchableOpacity onPress={completeOnboarding}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {ONBOARDING_DATA.map((item, index) => (
            <View key={index} style={styles.slide}>
              <View style={styles.iconContainer}>
                {item.icon}
              </View>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideDescription}>{item.description}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.pagination}>
            {ONBOARDING_DATA.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={goToNextSlide}
          >
            <Text style={styles.primaryButtonText}>
              {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            {currentIndex === ONBOARDING_DATA.length - 1 && (
              <ArrowRight size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Regular Welcome Screen (Not first launch)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/Epitome_logo_black.png')}
            style={styles.logo}
            resizeMode="contain"
          />
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
  // Onboarding Styles
  skipContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'flex-end',
    zIndex: 10,
  },
  skipText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0B172A',
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 32,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#F97316',
  },
  // Common Styles
  logoContainer: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 20,
  },
  logo: {
    width: 140,
    aspectRatio: 499 / 390,
    opacity: 1,
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
