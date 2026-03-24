import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { getSetting, setSetting } from '../database';

let LocalAuthentication: any = null;
if (Platform.OS !== 'web') {
  try {
    LocalAuthentication = require('expo-local-authentication');
  } catch {}
}

type UserRole = 'admin' | 'viewer' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  isLoading: boolean;
  login: (pin: string) => Promise<{ success: boolean; role: UserRole; error?: string }>;
  loginWithBiometric: () => Promise<{ success: boolean; role: UserRole; error?: string }>;
  logout: () => void;
  changePin: (role: 'admin' | 'viewer', newPin: string) => Promise<boolean>;
  isBiometricAvailable: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [lastRole, setLastRole] = useState<UserRole>(null);

  useEffect(() => {
    checkBiometricAvailability();
    loadLastRole();
  }, []);

  const checkBiometricAvailability = async () => {
    if (Platform.OS === 'web' || !LocalAuthentication) {
      setIsBiometricAvailable(false);
      setIsLoading(false);
      return;
    }
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);
    } catch {
      setIsBiometricAvailable(false);
    }
    setIsLoading(false);
  };

  const loadLastRole = async () => {
    try {
      const role = await getSetting('last_role');
      if (role === 'admin' || role === 'viewer') {
        setLastRole(role);
      }
    } catch {}
  };

  const login = useCallback(async (pin: string): Promise<{ success: boolean; role: UserRole; error?: string }> => {
    try {
      const adminPin = await getSetting('admin_pin');
      const viewerPin = await getSetting('viewer_pin');

      if (pin === adminPin) {
        setIsAuthenticated(true);
        setUserRole('admin');
        setLastRole('admin');
        await setSetting('last_role', 'admin');
        return { success: true, role: 'admin' };
      }

      if (pin === viewerPin) {
        setIsAuthenticated(true);
        setUserRole('viewer');
        setLastRole('viewer');
        await setSetting('last_role', 'viewer');
        return { success: true, role: 'viewer' };
      }

      return { success: false, role: null, error: 'Incorrect PIN' };
    } catch (error) {
      return { success: false, role: null, error: 'Login failed' };
    }
  }, []);

  const loginWithBiometric = useCallback(async (): Promise<{ success: boolean; role: UserRole; error?: string }> => {
    if (Platform.OS === 'web' || !LocalAuthentication) {
      return { success: false, role: null, error: 'Biometric not available' };
    }
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login to Maher Zarai Markaz',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: true,
      });

      if (result.success) {
        if (!lastRole) {
          return { success: false, role: null, error: 'Please login with PIN first' };
        }
        setIsAuthenticated(true);
        setUserRole(lastRole);
        return { success: true, role: lastRole };
      }

      return { success: false, role: null, error: 'Authentication failed' };
    } catch {
      return { success: false, role: null, error: 'Biometric authentication failed' };
    }
  }, [lastRole]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole(null);
  }, []);

  const changePin = useCallback(async (role: 'admin' | 'viewer', newPin: string): Promise<boolean> => {
    try {
      const key = role === 'admin' ? 'admin_pin' : 'viewer_pin';
      await setSetting(key, newPin);
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        isLoading,
        login,
        loginWithBiometric,
        logout,
        changePin,
        isBiometricAvailable,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
