# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains three artifacts: API Server, Component Preview Server, and Maher Zarai Markaz (Expo mobile app).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database (API)**: PostgreSQL + Drizzle ORM
- **Mobile App**: Expo React Native (offline-first SQLite)

## Structure

```
artifacts/
  api-server/        # Express API (port 8080)
  mockup-sandbox/    # Vite component preview (port 8081)
  maher-zari/        # Expo React Native app (Maher Zarai Markaz)
packages/
  shared/            # Shared TypeScript types
```

## Maher Zarai Markaz - Mobile App

### Purpose
Premium Android business management app for "Maher Zarai Markaz" (agricultural/pesticide shop in Rawalpindi). Features customer khata/ledger, inventory management, bill creation with WhatsApp sharing, AI notebook scanner, and offline-first SQLite database.

### Authentication
- Admin PIN: `000000` (full access)
- Viewer PIN: `111111` (read-only)
- Biometric (fingerprint) supported on native devices
- Role persisted in settings; biometric requires prior PIN login

### App Architecture
- **Navigation**: 5-tab layout (Khata | Stock | Bills | Scanner | More)
- **Database**: expo-sqlite with web in-memory fallback (conditional imports)
- **Design System**: Colors (`constants/colors.ts`), Theme (`constants/theme.ts`)
- **Icons**: @expo/vector-icons (Feather, MaterialCommunityIcons)
- **Gradients**: expo-linear-gradient

### Key Files
```
app/
  _layout.tsx          # Root layout - DB init, auth, navigation stack
  index.tsx            # Entry redirect (auth check)
  login.tsx            # PIN login screen with keypad
  (tabs)/
    _layout.tsx        # Tab bar configuration
    index.tsx          # Khata Book (customer ledger)
    stock.tsx          # Stock Book (inventory)
    bills.tsx          # Bills management
    scanner.tsx        # AI Notebook Scanner
    more.tsx           # Settings, reports, profile
  customer/[id].tsx    # Customer detail with transactions
  add-customer.tsx     # Add customer/supplier form
  add-transaction.tsx  # Add credit/payment form
  add-product.tsx      # Add product form
  add-stock.tsx        # Stock in/out form
  create-bill.tsx      # Bill creation with item picker
  bill/[id].tsx        # Bill detail with WhatsApp sharing
  scan-review.tsx      # AI scan result review
  recycle-bin.tsx      # Deleted customers restore
constants/
  colors.ts            # Color palette with gradients
  theme.ts             # Typography, spacing, shadows
contexts/
  AuthContext.tsx       # Auth state, PIN verification, biometric
database/
  index.ts             # All CRUD operations + web fallback
  schema.ts            # SQLite table definitions
data/
  customers.ts         # 119 seed customers
  products.ts          # 170+ seed products
```

### Database Operations (database/index.ts)
- **Customers**: getCustomers, getCustomer, addCustomer, updateCustomer, softDeleteCustomer, restoreCustomer, searchCustomers, getDeletedCustomers
- **Products**: getProducts, getProduct, addProduct, updateProduct, softDeleteProduct, updateProductStock, searchProducts, getLowStockProducts
- **Transactions**: addTransaction, getTransactions, getAllTransactions, deleteTransaction
- **Stock**: addStockEntry, getStockEntries
- **Bills**: createBill, getBills, getBill, getBillItems, updateBillPayment
- **Stats**: getDashboardStats, getMonthlyStats
- **Settings**: getSetting, setSetting

### Web Compatibility
- expo-sqlite uses WASM on web — all DB imports conditional via `Platform.OS === 'web'`
- expo-local-authentication and expo-image-picker conditionally required (not statically imported)
- Share.share guarded with Platform check (clipboard fallback on web)
- Alert.prompt replaced with cross-platform Modal (iOS-only API)

### Color Scheme
- Primary Orange: `#FF6B35`
- Red: `#E53935`
- Green: `#2E7D32`
- Background: `#F7F8FA`
- Gradients for headers, FABs, action buttons
