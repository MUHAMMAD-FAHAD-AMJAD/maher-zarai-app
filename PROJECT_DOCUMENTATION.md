# Maher Zarai Markaz - Complete Project Documentation

## Project Overview

**App Name**: Maher Zarai Markaz  
**Business**: Agricultural/Pesticide Shop, Rawalpindi, Pakistan  
**Platform**: Android (Expo React Native)  
**Architecture**: Offline-first SQLite, Zero monthly cost  
**Status**: Fully Built & Tested  

---

## Phase-by-Phase Implementation

### Phase 1: Foundation (Completed)
- Project scaffolding with Expo + React Native in pnpm monorepo
- SQLite database setup with expo-sqlite
- Web in-memory fallback for all database operations (Platform.OS === 'web')
- Database schema: customers, products, transactions, bills, bill_items, stock_entries, settings
- Seeded 119 customers + 170+ products from real shop data
- 6-digit PIN authentication (Admin: 000000, Viewer: 111111)
- Fingerprint/biometric authentication support
- 5-tab navigation: Khata | Stock | Bills | Scanner | More
- Error boundary and splash screen handling

### Phase 2: Design System (Completed)
- Premium color palette with orange (#FF6B35), red (#E53935), green (#2E7D32)
- Gradient system (primary, success, danger gradients)
- Typography system (Inter font family: Regular, Medium, SemiBold, Bold)
- Spacing scale, border radius tokens, shadow system (small/medium/large)
- Glass morphism effects and colored shadows
- Consistent design across all screens

### Phase 3: Khata Book / Customer Ledger (Completed)
- Dashboard with "You Will Get" / "You Will Give" summary cards
- Customer list with avatar initials, colored by name hash
- Customer/Supplier type filtering with pills
- Full-text search by name or phone
- Customer detail screen with gradient header and balance display
- Add/edit customer flow with customer/supplier toggle
- Transaction history per customer (credit/payment)
- Add credit (udhar) and record payment flows
- Soft delete customers with recycle bin restore

### Phase 4: Stock Book / Inventory Management (Completed)
- Product dashboard with Total, In Stock, Low, Out of Stock counts
- Product list with category icons (Fertilizer/Pesticide/Seed/Equipment)
- Stock quantity badges (green=in stock, yellow=low, red=out)
- Category and unit chip selectors
- Add product with name, category, unit, opening stock, purchase/sale price
- Profit margin calculator
- Stock In / Stock Out flows with product search
- Rate and total amount calculation
- Low stock alerts

### Phase 5: Bills System (Completed)
- Bill creation with searchable customer picker
- Product search and add to bill with quantity/price editing
- Line item management with running subtotal
- Auto stock deduction on bill creation
- Auto transaction creation for customer (credit entry)
- Bill listing with monthly stats (Total Sales, Bill Count, Payments)
- Status filters: All / Unpaid / Paid
- Bill detail with items table, summary, balance due
- Cross-platform payment recording modal (works on Android, iOS, and Web)
- WhatsApp bill sharing with formatted text message

### Phase 6: AI Notebook Scanner (Completed)
- Camera integration with expo-image-picker
- Step-by-step onboarding (Capture -> AI Process -> Confirm)
- Scan review screen with AI-extracted entries
- Entry confirmation with checkboxes (include/exclude)
- Entry type display (Credit/Payment) with amounts
- Web platform guard (camera only available on Android)
- Placeholder for Gemini 1.5 Flash integration

### Phase 7: More Screen / Settings (Completed)
- Premium profile card with gradient background
- Store info: Maher Zarai Markaz, Rawalpindi
- Role badge (Admin/Viewer) with icon
- Quick actions: Backup, Export, Share
- Reports menu: Daily Summary, Customer Report, Stock Report, Monthly Report, Outstanding Debt
- Settings: Google Drive Backup, Recycle Bin, Change Admin PIN, Change Viewer PIN, About App
- Logout with confirmation
- Cross-platform Share (native Share API / web clipboard fallback)

### Phase 8: Security & Cross-Platform Fixes (Completed)
- Biometric auth no longer defaults to admin if no lastRole saved
- Alert.prompt replaced with cross-platform Modal for Android compatibility
- Share.share guarded with Platform check
- expo-local-authentication conditionally imported
- expo-image-picker conditionally imported
- All database imports conditional for web compatibility

---

## Authentication System

| Role | PIN | Access Level |
|------|-----|-------------|
| Admin | 000000 | Full CRUD access, delete, PIN change |
| Viewer | 111111 | Read-only access, no create/edit/delete |

- Biometric (fingerprint) login supported on native devices
- Requires prior PIN login to establish role
- Role stored in settings table, persisted across sessions

---

## Database Schema

### Tables
1. **settings** - Key-value store for app configuration
2. **customers** - Customer/supplier records with soft delete
3. **products** - Product catalog with stock tracking
4. **transactions** - Credit/payment ledger entries
5. **bills** - Bill headers with status tracking
6. **bill_items** - Line items per bill
7. **stock_entries** - Stock in/out log

### Key Operations (database/index.ts)
- Customers: CRUD, search, soft delete, restore, balance tracking
- Products: CRUD, search, stock update, low stock detection
- Transactions: add, list, delete (with balance reversal)
- Bills: create (with stock deduction + transaction), list, detail, payment recording
- Stock: entry creation (with auto stock update), history
- Stats: dashboard totals, monthly reports

---

## File Structure

```
artifacts/maher-zari/
├── app/
│   ├── _layout.tsx              # Root layout (DB init, auth, navigation)
│   ├── index.tsx                # Entry redirect
│   ├── login.tsx                # PIN login with keypad
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab bar (5 tabs)
│   │   ├── index.tsx            # Khata Book
│   │   ├── stock.tsx            # Stock Book
│   │   ├── bills.tsx            # Bills Management
│   │   ├── scanner.tsx          # AI Scanner
│   │   └── more.tsx             # Settings & Reports
│   ├── customer/[id].tsx        # Customer Detail
│   ├── add-customer.tsx         # Add Customer Form
│   ├── add-transaction.tsx      # Add Credit/Payment
│   ├── add-product.tsx          # Add Product Form
│   ├── add-stock.tsx            # Stock In/Out Form
│   ├── create-bill.tsx          # Bill Creation
│   ├── bill/[id].tsx            # Bill Detail
│   ├── scan-review.tsx          # Scan Review
│   └── recycle-bin.tsx          # Deleted Items Restore
├── constants/
│   ├── colors.ts                # Color palette with gradients
│   └── theme.ts                 # Typography, spacing, shadows
├── contexts/
│   └── AuthContext.tsx           # Auth state management
├── database/
│   ├── index.ts                 # All CRUD operations + web fallback
│   └── schema.ts                # SQLite table definitions
├── data/
│   ├── customers.ts             # 119 seed customers
│   └── products.ts              # 170+ seed products
└── components/
    └── ErrorBoundary.tsx         # Error boundary wrapper
```

---

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| Expo SDK 53 | React Native framework |
| expo-router | File-based navigation |
| expo-sqlite | SQLite database |
| expo-linear-gradient | Gradient effects |
| expo-local-authentication | Biometric auth |
| expo-image-picker | Camera access |
| expo-haptics | Haptic feedback |
| @expo/vector-icons | Icon library |
| @tanstack/react-query | Data fetching |
| react-native-safe-area-context | Safe area handling |
| react-native-gesture-handler | Gesture support |
| Inter font family | Typography |

---

## Pending Features (Future Work)

1. **Gemini 1.5 Flash Integration** - Connect AI scanner to actual OCR API
2. **Google Drive Backup** - Automatic cloud backup of SQLite database
3. **OTP Recovery** - Phone number based data recovery with OTP verification
4. **PDF Export** - Customer statements and reports as PDF
5. **Push Notifications** - Low stock alerts, payment reminders
6. **Size Variants** - Product size/weight variant support

---

## Testing Results

All e2e tests passing:
1. Login screen with PIN pad - PASS
2. Admin login (000000) - PASS
3. Khata Book with summary cards, customer list, search, tabs - PASS
4. Add Customer form with all fields - PASS
5. Customer Detail with transaction history - PASS
6. Stock Book with stats, product list, category filtering - PASS
7. Add Product form with category/unit chips - PASS
8. Bills screen with filters - PASS
9. Scanner screen with step cards - PASS
10. More screen with profile, reports, settings - PASS
