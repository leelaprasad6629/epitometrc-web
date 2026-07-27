import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { API_BASE_URL, getStoredToken, setStoredToken } from '@/services/api';

interface PortalWebViewProps {
  path: string;
}

export default function PortalWebView({ path }: PortalWebViewProps) {
  const router = useRouter();
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
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  const targetUrl = `${API_BASE_URL}${path}`;

  // Javascript to set session cookie on the webview side
  const injectedJS = token
    ? `
      document.cookie = "token=${token}; path=/; max-age=86400; SameSite=Lax";
      localStorage.setItem("token", "${token}");
      true;
    `
    : 'true;';

  const handleNavigationStateChange = async (navState: any) => {
    const url = navState.url;
    // Intercept redirects to login/home screen and log out natively
    if (
      url.includes('/login') ||
      url === `${API_BASE_URL}/` ||
      url === `${API_BASE_URL}` ||
      url === 'https://epitometrc-web.vercel.app/' ||
      url === 'https://epitometrc-web.vercel.app'
    ) {
      await setStoredToken(null);
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
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
          <ActivityIndicator size="large" color="#F97316" />
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
  },
  overlayLoader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
  },
});
