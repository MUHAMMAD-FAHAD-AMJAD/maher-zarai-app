import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { initializeDatabase, seedDataIfNeeded } from "@/database";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="customer/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="add-customer" options={{ headerShown: false }} />
      <Stack.Screen name="add-transaction" options={{ headerShown: false }} />
      <Stack.Screen name="add-product" options={{ headerShown: false }} />
      <Stack.Screen name="add-stock" options={{ headerShown: false }} />
      <Stack.Screen name="create-bill" options={{ headerShown: false }} />
      <Stack.Screen name="bill/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="scan-review" options={{ headerShown: false }} />
      <Stack.Screen name="recycle-bin" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initializeDatabase();
        await seedDataIfNeeded();
        setDbReady(true);
      } catch (e) {
        console.error('Database init error:', e);
        setDbReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, dbReady]);

  if ((!fontsLoaded && !fontError) || !dbReady) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <KeyboardProvider>
              <AuthProvider>
                <RootLayoutNav />
              </AuthProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
