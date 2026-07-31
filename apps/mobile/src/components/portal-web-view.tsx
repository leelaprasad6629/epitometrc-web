import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_BASE_URL, getStoredToken, setStoredToken } from '@/services/api';

interface PortalWebViewProps {
  path: string;
}

// Premium dashboard card and layout skeleton loader
export const DashboardSkeleton = () => {
  return (
    <View style={styles.skeletonContainer}>
      {/* Header App Bar Skeleton */}
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonMenuBtn} />
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonActions}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonAvatar} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.skeletonBody} scrollEnabled={false} showsVerticalScrollIndicator={false}>
        {/* Welcome Card Skeleton */}
        <View style={styles.skeletonWelcomeCard}>
          <View style={[styles.skeletonLine, { width: '35%', height: 10, marginBottom: 12, backgroundColor: '#FFE4D6' }]} />
          <View style={[styles.skeletonLine, { width: '70%', height: 18, marginBottom: 10 }]} />
          <View style={[styles.skeletonLine, { width: '85%', height: 12 }]} />
        </View>

        {/* Action Center Alert Skeleton */}
        <View style={styles.skeletonCard}>
          <View style={[styles.skeletonLine, { width: '40%', height: 8, marginBottom: 12 }]} />
          <View style={[styles.skeletonLine, { width: '90%', height: 12, marginBottom: 8 }]} />
          <View style={[styles.skeletonLine, { width: '65%', height: 10 }]} />
        </View>

        {/* Stats Grid Skeletons */}
        <View style={styles.skeletonGrid}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.skeletonGridCard}>
              <View style={styles.skeletonGridHeader}>
                <View style={[styles.skeletonLine, { width: '50%', height: 8 }]} />
                <View style={styles.skeletonGridIcon} />
              </View>
              <View style={[styles.skeletonLine, { width: '70%', height: 16, marginTop: 8 }]} />
            </View>
          ))}
        </View>

        {/* Activities List Skeletons */}
        <View style={styles.skeletonCard}>
          <View style={[styles.skeletonLine, { width: '30%', height: 10, marginBottom: 14 }]} />
          {[1, 2].map((i) => (
            <View key={i} style={styles.skeletonRow}>
              <View style={[styles.skeletonLine, { width: '80%', height: 8, marginBottom: 6 }]} />
              <View style={[styles.skeletonLine, { width: '45%', height: 7 }]} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default function PortalWebView({ path }: PortalWebViewProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [token, setToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const [webViewLoaded, setWebViewLoaded] = useState(false);

  useEffect(() => {
    async function loadToken() {
      const storedToken = await getStoredToken();
      setToken(storedToken);
      setLoadingToken(false);
    }
    loadToken();

    // Safety fallback: Hide the loading spinner after 4 seconds to prevent getting stuck
    const timer = setTimeout(() => {
      setWebViewLoaded(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (loadingToken) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <DashboardSkeleton />
      </View>
    );
  }

  const targetUrl = `${API_BASE_URL}${path}`;

  // CSS injected into WebView to ensure mobile production polish:
  // 1. Z-index hierarchy: Portals, dropdowns, popups, modals, bottom sheets render on top (z-index: 99999).
  // 2. Profile skeleton / zero persistent "Loading..." state.
  // 3. Prevent clipping, overflow and horizontal scroll on mobile viewport.
  // 4. Responsive headers, cards, upload area, tabs and buttons for AI Resume Studio & AI Career Copilot.
  // 5. Keep floating AI button visible and elevated without covering action buttons/forms.
  // 6. Match theme colors and contrast.
  const injectedCSS = `
    (function() {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = \`
        /* 1. Portal & Popup Z-Index Rules */
        [role="dialog"], [role="menu"], [role="listbox"], [data-radix-portal], .radix-portal, div[style*="z-index"] {
          z-index: 99999 !important;
        }

        /* 2. Layout & Overflow Constraints */
        html, body {
          overflow-x: hidden !important;
          max-width: 100vw !important;
          -webkit-overflow-scrolling: touch;
        }

        /* 3. Floating AI button positioning (never covers form actions/uploads) */
        .floating-ai-btn, [data-ai-button="true"], button[aria-label*="AI"] {
          bottom: 24px !important;
          right: 16px !important;
          z-index: 9990 !important;
        }

        /* 4. Responsive adjustments for AI Resume Studio & Copilot */
        .resume-builder-container, .ai-copilot-container {
          padding-left: 12px !important;
          padding-right: 12px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        /* Smooth contrast and theme alignment */
        @media (prefers-color-scheme: dark) {
          body {
            background-color: #0b172a !important;
            color: #f8fafc !important;
          }
        }
      \`;
      document.head.appendChild(style);
    })();
  `;

  // Javascript to set session cookie on the webview side and inject CSS
  const injectedJS = token
    ? `
      document.cookie = "token=${token}; path=/; max-age=86400; SameSite=Lax";
      localStorage.setItem("token", "${token}");
      ${injectedCSS}
      true;
    `
    : `${injectedCSS} true;`;

  const handleNavigationStateChange = async (navState: any) => {
    const url = navState.url;
    // Intercept redirects to login/logout screens and log out natively
    if (url.includes('/login') || url.includes('/logout')) {
      await setStoredToken(null);
      router.replace('/');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <WebView
        source={{
          uri: targetUrl,
          headers: token
            ? {
                'Authorization': `Bearer ${token}`,
                'Cookie': `token=${token}`,
              }
            : undefined,
        }}
        injectedJavaScript={injectedJS}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadEnd={() => setWebViewLoaded(true)}
        onError={() => setWebViewLoaded(true)}
        onHttpError={() => setWebViewLoaded(true)}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        style={styles.webview}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
      />
      {!webViewLoaded && (
        <View style={styles.overlayLoader}>
          <DashboardSkeleton />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  webview: {
    flex: 1,
  },
  overlayLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F5F9FF',
  },
  // Skeleton Layout Styling
  skeletonContainer: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    paddingHorizontal: 16,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 16,
  },
  skeletonMenuBtn: {
    width: 24,
    height: 18,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  skeletonTitle: {
    width: 140,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  skeletonActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skeletonIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  skeletonAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  skeletonBody: {
    gap: 16,
    paddingBottom: 24,
  },
  skeletonWelcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skeletonLine: {
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skeletonGridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skeletonGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonGridIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  skeletonRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
