# FINAL BUILD PROMPT — GIVE THIS TO CLAUDE AI
# Mahar Zarai Markaz — Complete DigiKhata Clone + Custom Features
# Version: 2.0 FINAL | Date: March 2026

═══════════════════════════════════════════════════════════════════
CRITICAL INSTRUCTION: READ EVERY WORD. DO NOT SKIP ANY SECTION.
DO NOT ASK ME ANY QUESTIONS. BUILD EVERYTHING EXACTLY AS WRITTEN.
BUILD PHASE BY PHASE. SHOW ME EACH PHASE RESULT BEFORE NEXT PHASE.
═══════════════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1 — WHAT YOU ARE BUILDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are building a PREMIUM Android mobile app for "Mahar Zarai Markaz" — 
an agricultural and pesticide shop in Sargodha, Punjab, Pakistan.

The app is a COMPLETE CLONE of DigiKhata (Pakistani khata/ledger app) 
with custom agricultural features added on top.

DigiKhata facts you must know before building:
- Package: com.androidapp.digikhata | Version 9.3.8 | Rating 4.6 | 5M+ downloads
- Developer: DigiKhata Business Apps (DigiKhata Pvt Ltd), founded 2020, Pakistan
- It is the #1 bookkeeping app for Pakistani small businesses
- Supports: English, Urdu, Roman Urdu, Sindhi
- Core features: Customer ledger (udhar khata), Supplier ledger, CashBook, 
  Stock Book, Bills/Invoices, Reports, Backup, WhatsApp reminders
- Business model: Freemium — free core, premium for bulk features
- Primary users: Shopkeepers, kiryana stores, small retailers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2 — SHOP INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Shop Name (English):  Mahar Zarai Markaz
Shop Name (Urdu):     ماہر زرعی مرکز
Shop Type:            Agricultural & Pesticide Shop (زرعی دکان)
Location:             Sargodha, Punjab, Pakistan
Phone:                +923452902229 (used for ALL purposes: calls, bills, WhatsApp)
Owner:                Muhammad Mahad Amjad
NO LOGO:              Do NOT add any logo anywhere. Text-based branding only.
Target Devices:       Infinix and Tecno Android phones (720p–1080p screens)
Currency:             Always show "Rs." before every number (Rs. 1,234)
Date Format:          DD/MM/YY (e.g., 28/03/26)
Primary Language:     Bilingual — Urdu and English throughout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 3 — TECHNOLOGY STACK (USE EXACTLY THIS — NO DEVIATIONS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Framework:         Expo React Native (latest stable SDK)
Language:          TypeScript (strict mode)
Navigation:        expo-router (file-based routing — all screens as files)
Database:          expo-sqlite (local SQLite — offline-first, no server costs)
UI Components:     Custom built — NO third party UI library
Gradients:         expo-linear-gradient
Icons:             @expo/vector-icons (MaterialCommunityIcons + Feather)
Fonts:             @expo-google-fonts/inter (weights: 400, 500, 600, 700)
Auth:              OTP-based (see Part 4)
State:             React Context + useReducer
Data Fetching:     Custom hooks with SQLite
Gestures:          react-native-gesture-handler (swipe actions on lists)
Safe Areas:        react-native-safe-area-context
Biometric:         expo-local-authentication (CONDITIONAL import only)
Camera/Gallery:    expo-image-picker (CONDITIONAL import only)
Haptics:           expo-haptics
Blur:              expo-blur (iOS only, plain white Android)
Sharing:           expo-sharing + Linking (WhatsApp intent)

CRITICAL PLATFORM COMPATIBILITY RULES — FOLLOW EXACTLY:
1. ALL expo-sqlite code: wrap in Platform.OS !== 'web' check. Web uses empty arrays.
2. expo-local-authentication: NEVER static import. Use require() inside async function.
3. expo-image-picker: NEVER static import. Use require() inside async function.
4. NEVER use Alert.prompt() — iOS only. Always use custom Modal with TextInput.
5. Share.share(): guard with if (Platform.OS !== 'web'), else use Clipboard.
6. BlurView: only on iOS. Android and web get plain white background.
7. Tab bar: BlurView on iOS, plain #FFFFFF on Android.
8. All FlatList: contentContainerStyle={{ paddingBottom: 140 }} minimum.

FOLDER STRUCTURE:
app/                    expo-router screens
  _layout.tsx           root layout (DB init, auth check, providers)
  login.tsx             phone number entry
  otp-verify.tsx        OTP verification
  (tabs)/               bottom tab screens
    index.tsx           Home/Dashboard
    khata.tsx           Customer Ledger
    stock.tsx           Stock Book
    bills.tsx           Bills/Invoices
    more.tsx            More/Settings
  customer/
    [id].tsx            Customer detail
  add-customer.tsx      Add/Edit customer
  add-transaction.tsx   Add credit or payment
  product/
    [id].tsx            Product detail
  add-product.tsx       Add/Edit product
  add-variant.tsx       Add/Edit product variant
  stock-in.tsx          Stock received form
  stock-out.tsx         Stock dispatch form
  bill/
    [id].tsx            Bill detail
  create-bill.tsx       Bill creation wizard
  scanner.tsx           AI notebook scanner
  scan-review.tsx       Review AI scan results
  reports/
    index.tsx           Reports menu
    daily.tsx           Daily summary
    outstanding.tsx     Customer outstanding
    stock.tsx           Stock value report
    monthly.tsx         Monthly sales
    profit.tsx          Profit & loss
    customer-ledger.tsx Per-customer ledger
  settings/
    index.tsx           Settings main
    otp.tsx             Change phone number
    reminder.tsx        WhatsApp reminder settings
  recycle-bin.tsx       Deleted items restore

components/
  ui/                   Reusable UI components (see Part 5)
  forms/                Form components
  lists/                List item components

database/
  index.ts              All CRUD functions
  schema.ts             Table definitions and migrations

contexts/
  AuthContext.tsx        OTP auth state
  ThemeContext.tsx       Theme/colors

constants/
  colors.ts             Full color palette
  theme.ts              Spacing, typography, borders
  strings.ts            All UI text (bilingual)

utils/
  gemini.ts             Gemini AI API functions
  whatsapp.ts           WhatsApp sharing functions
  fuzzy.ts              Fuzzy name matching
  format.ts             Rs. formatting, date formatting

data/
  customers.ts          Seed customers array (empty — filled later)
  products.ts           Seed products array (empty — filled later)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 4 — AUTHENTICATION SYSTEM (OTP-BASED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NO PIN SYSTEM. NO EMAIL/PASSWORD. OTP-BASED ONLY.

ONBOARDING FLOW (first time only):
Screen 1 — Splash Screen (2 seconds):
- White background
- App name "ماہر زرعی مرکز" in large Urdu text (deep green color)
- "Mahar Zarai Markaz" below in English (warm gold color)
- "Sargodha, Punjab, Pakistan" small text below
- Green animated leaf or wheat icon above the name
- Loading dots animation at bottom
- Auto-navigates to Welcome screens after 2 seconds

Screen 2–4 — Welcome Slides (3 slides, skippable):
- Green gradient background (#1B5E20 to #2E7D32)
- White text, illustration icons
- Slide 1: "آپ کا ڈیجیٹل کھاتہ" / "Your Digital Khata" — customer ledger illustration
- Slide 2: "اسٹاک مینجمنٹ" / "Stock Management" — product boxes illustration
- Slide 3: "رپورٹس اور بلز" / "Reports & Bills" — chart illustration
- Progress dots at top
- "Skip" button top right (text button, white)
- "Next" button bottom right (outlined white)
- "شروع کریں / Get Started" on final slide (filled gold button)

Screen 5 — Language Selection:
- "زبان منتخب کریں / Select Language" title
- Two large cards: Urdu (اردو) | English
- Selected card has green border and checkmark
- "Continue" button at bottom

Screen 6 — Phone Number Entry:
- Header: "نمبر درج کریں / Enter Your Number"
- Subtitle: "ہم آپ کو OTP بھیجیں گے / We'll send you an OTP"
- Country code: +92 (Pakistan, non-editable)
- Phone input: "03XX-XXXXXXX" placeholder, numeric keyboard
- "OTP بھیجیں / Send OTP" green filled button
- Below: "آپ کا نمبر محفوظ رہے گا / Your number is private"
- Loading spinner during OTP send

Screen 7 — OTP Verification:
- Header: "تصدیق کریں / Verify OTP"
- Subtitle: "6 ہندسے +92XXXXXXXXXX پر بھیجے / 6 digits sent to [number]"
- 6 individual input boxes (auto-focus next on each digit)
- Auto-verify when 6th digit entered
- Resend timer: "دوبارہ بھیجیں 60s میں / Resend in 60s" countdown
- "تبدیل کریں / Change Number" link below
- Success: green checkmark animation → navigate to Business Setup
- Error: shake animation on boxes, "غلط کوڈ / Wrong OTP" in red

Screen 8 — Business Setup (first time only):
- Header: "دکان کی معلومات / Shop Details"
- Pre-filled: "Mahar Zarai Markaz" (editable)
- Owner name field: "Muhammad Mahad Amjad" (editable)
- Phone: auto-filled from login
- "مکمل کریں / Complete" button
- Navigates to Permissions screen

Screen 9 — Permission Requests:
- Contacts: "گاہکوں کو نمبر سے ڈھونڈیں / Find customers by phone"
- Storage: "بیک اپ محفوظ کریں / Save backups"
- Notifications: "یاد دہانی / Reminders"
- Each has Allow/Skip buttons

RETURNING USER LOGIN:
- Splash → Phone Number Entry → OTP → Home (skip all setup screens)
- This IS the data restoration — OTP login = data synced automatically

ROLES:
ADMIN:
- Full access: add, edit, delete, all reports, all settings
- All buttons visible and active

VIEWER:
- Same UI, same screens, same data visibility
- Cannot add/edit/delete ANYTHING
- All FAB buttons hidden
- All edit/delete buttons hidden
- Settings button shows "صرف ایڈمن / Admin Only" toast
- Role badge shown prominently

BIOMETRIC (optional, after first login):
- After successful OTP login, prompt: "فنگرپرنٹ لاگ ان چالو کریں؟ / Enable fingerprint login?"
- If enabled: fingerprint icon on next launch instead of phone entry
- Must use conditional require() — never static import
- Stores: last role + auth token in SecureStore

NO AUTO-LOCK. NO SESSION TIMEOUT. NO PASSCODE SCREEN.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 5 — DESIGN SYSTEM (IMPLEMENT FIRST BEFORE ANY SCREENS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COLOR PALETTE (constants/colors.ts):
Primary:           #1B5E20  (Deep Forest Green)
PrimaryDark:       #003300  (Very dark green)
PrimaryLight:      #4CAF50  (Medium green)
PrimaryFaint:      #E8F5E9  (Very light green background tint)
Accent:            #F9A825  (Warm Gold/Harvest Yellow)
AccentDark:        #F57F17  (Darker gold)
AccentLight:       #FFF8E1  (Very light gold tint)
Background:        #F0F4F0  (Off-white with green tint)
Surface:           #FFFFFF  (Pure white — cards)
SurfaceAlt:        #FAFAFA  (Very light gray)
TextPrimary:       #1A1A1A  (Near black)
TextSecondary:     #555555  (Medium gray)
TextMuted:         #888888  (Light gray)
TextOnPrimary:     #FFFFFF  (White text on green bg)
TextOnAccent:      #1A1A1A  (Dark text on gold bg)
Success:           #2E7D32  (Dark green — paid, positive)
SuccessLight:      #E8F5E9  (Light green bg)
Danger:            #C62828  (Dark red — unpaid, negative)
DangerLight:       #FFEBEE  (Light red bg)
Warning:           #FF8F00  (Amber — low stock, reminders)
WarningLight:      #FFF8E1  (Light amber bg)
Divider:           #E0E0E0  (Light gray lines)
Shadow:            rgba(0,0,0,0.08)
Overlay:           rgba(0,0,0,0.5)
TabBarBg:          #FFFFFF
HeaderBg:          #1B5E20  (Deep green header)
HeaderText:        #FFFFFF
BadgeRed:          #E53935
BadgeText:         #FFFFFF
DisabledBg:        #E0E0E0
DisabledText:      #9E9E9E

GRADIENTS (use expo-linear-gradient):
PrimaryGradient:   ['#1B5E20', '#2E7D32'] (top to bottom)
AccentGradient:    ['#F9A825', '#F57F17']
CardGradient:      ['#FFFFFF', '#F8FFF8']
DangerGradient:    ['#C62828', '#E53935']

TYPOGRAPHY (constants/theme.ts — using Inter font):
fontSize.xs:       11
fontSize.sm:       12
fontSize.base:     14
fontSize.md:       16
fontSize.lg:       18
fontSize.xl:       20
fontSize.2xl:      24
fontSize.3xl:      28
fontSize.4xl:      32

fontWeight.regular:   '400'
fontWeight.medium:    '500'
fontWeight.semibold:  '600'
fontWeight.bold:      '700'

lineHeight.tight:  1.2
lineHeight.normal: 1.5
lineHeight.relaxed: 1.8

SPACING:
spacing.xs:   4
spacing.sm:   8
spacing.md:   12
spacing.base: 16
spacing.lg:   20
spacing.xl:   24
spacing.2xl:  32
spacing.3xl:  48

BORDERS:
borderRadius.sm:   8
borderRadius.md:   12
borderRadius.lg:   16
borderRadius.xl:   24
borderRadius.full: 9999

SHADOWS:
shadowSm: { shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.06, shadowRadius:3, elevation:2 }
shadowMd: { shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.08, shadowRadius:6, elevation:4 }
shadowLg: { shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.10, shadowRadius:12, elevation:8 }

REUSABLE UI COMPONENTS (build all of these in components/ui/):

1. Button.tsx
   - variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
   - size: 'sm' | 'md' | 'lg'
   - loading: boolean (shows spinner, disables tap)
   - icon: optional left icon name
   - fullWidth: boolean
   - Primary: LinearGradient (#1B5E20 → #2E7D32), white text, 56px height, 28px radius
   - Secondary: gold gradient, dark text
   - Outline: green border, transparent bg, green text
   - Ghost: no border, green text only
   - Danger: red gradient

2. Input.tsx
   - label: string (shows above field)
   - placeholder: string
   - error: string (shows below in red)
   - prefix: string (e.g., "Rs.")
   - suffix: string
   - keyboardType
   - multiline: boolean
   - Outlined style, 56px height, 8px radius
   - Default border: #E0E0E0
   - Focused border: #1B5E20 (2px)
   - Error border: #C62828 (2px)
   - Floating label animation on focus

3. Card.tsx
   - padding: number
   - shadow: 'sm' | 'md' | 'lg'
   - onPress: optional
   - White background, 12px radius, subtle shadow
   - Press state: slight scale down 0.98

4. Badge.tsx
   - type: 'success' | 'danger' | 'warning' | 'info' | 'primary'
   - size: 'sm' | 'md'
   - text: string
   - Colored background (light), matching text color

5. Avatar.tsx
   - name: string (generates initials)
   - size: 'sm' | 'md' | 'lg' | 'xl'
   - color: auto-generated from name hash (one of 8 colors)
   - imageUri: optional (shows photo if available)
   - Circle shape, initials in white bold

6. Modal.tsx
   - visible: boolean
   - title: string
   - onClose: function
   - White background, 24px radius top corners
   - Dark overlay behind
   - Slide up animation

7. BottomSheet.tsx
   - visible: boolean
   - onClose: function
   - snapPoints: number[]
   - Drag handle at top (4px wide gray bar)
   - 28px radius top corners

8. EmptyState.tsx
   - icon: string (Feather icon name)
   - title: string
   - subtitle: string
   - actionLabel: string (optional)
   - onAction: function (optional)
   - Centered, icon above, title bold, subtitle muted

9. SkeletonLoader.tsx
   - Animated shimmer effect (light gray → lighter gray)
   - Shape variants: line, circle, rectangle
   - Show while data is loading

10. ListItem.tsx
    - title: string
    - subtitle: string (optional)
    - amount: string (optional — shown on right, colored)
    - amountType: 'positive' | 'negative' | 'neutral'
    - leftElement: component (avatar, icon)
    - rightElement: component (chevron, badge)
    - onPress: function
    - 72–88px height, 16px horizontal padding, divider below

11. SectionHeader.tsx
    - title: string
    - actionLabel: string (optional — "See All")
    - onAction: function (optional)

12. StatCard.tsx
    - title: string
    - value: string (large amount or count)
    - icon: string
    - color: 'primary' | 'success' | 'danger' | 'warning'
    - gradient: boolean
    - Compact card, icon top-right, value large below title

13. SearchBar.tsx
    - placeholder: string
    - value: string
    - onChangeText: function
    - onClear: function
    - Gray background input, search icon left, clear X right

14. FAB.tsx (Floating Action Button)
    - icon: string
    - onPress: function
    - label: string (optional — extended FAB)
    - Primary green gradient, 56px circle, bottom-right position
    - Bounce animation on mount

15. SwipeableRow.tsx
    - leftActions: [{icon, color, onPress}]
    - rightActions: [{icon, color, onPress}]
    - children: the row content
    - Haptic feedback on action trigger

BOTTOM TAB BAR:
- 5 tabs: Home | Khata | Stock | Bills | More
- Height: 80px
- Background: white (Android), BlurView (iOS only)
- Active tab: filled icon, primary green label, green dot indicator
- Inactive tab: outline icon, gray label
- Icons (MaterialCommunityIcons):
  Home: 'view-dashboard'
  Khata: 'book-account'
  Stock: 'package-variant-closed'
  Bills: 'receipt'
  More: 'dots-horizontal-circle'
- No badge by default (add red badge for pending items if any)

TOP HEADER (each screen):
- Height: 56px + status bar
- Background: LinearGradient ['#1B5E20','#2E7D32']
- Title: white, 18sp, semibold, left-aligned
- Left: back arrow (white) or menu
- Right: search icon, add icon, or kebab menu (3 dots)
- Status bar: white icons

ANIMATIONS:
- Screen enter: slide from right (push), slide from bottom (modal)
- List items: stagger fade-up (50ms delay each item)
- FAB: scale 0 → 1 with bounce on mount
- Card press: scale 0.98, opacity 0.9
- Skeleton: shimmer left to right
- Success: green checkmark scale animation
- Delete: slide left + fade out
- Bottom sheet: slide up from bottom
- Loading button: spinner replaces text

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 6 — DATABASE SCHEMA (ALL TABLES — IMPLEMENT EXACTLY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enable in SQLite before any queries:
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;

TABLE: settings
  key TEXT PRIMARY KEY
  value TEXT

TABLE: users
  id INTEGER PRIMARY KEY AUTOINCREMENT
  phone TEXT NOT NULL UNIQUE
  name TEXT
  role TEXT DEFAULT 'admin'  -- 'admin' or 'viewer'
  business_name TEXT
  created_at TEXT DEFAULT (datetime('now'))

TABLE: customers
  id INTEGER PRIMARY KEY AUTOINCREMENT
  name TEXT NOT NULL
  phone TEXT
  type TEXT DEFAULT 'customer'  -- 'customer' or 'supplier'
  opening_balance REAL DEFAULT 0
  current_balance REAL DEFAULT 0
  city TEXT
  cnic TEXT
  notes TEXT
  is_deleted INTEGER DEFAULT 0
  deleted_at TEXT
  created_at TEXT DEFAULT (datetime('now'))
  updated_at TEXT DEFAULT (datetime('now'))

TABLE: transactions
  id INTEGER PRIMARY KEY AUTOINCREMENT
  customer_id INTEGER REFERENCES customers(id)
  type TEXT NOT NULL  -- 'credit' | 'payment' | 'return'
  amount REAL NOT NULL
  description TEXT
  date TEXT NOT NULL
  bill_id INTEGER REFERENCES bills(id)
  image_url TEXT
  is_deleted INTEGER DEFAULT 0
  deleted_at TEXT
  created_at TEXT DEFAULT (datetime('now'))

TABLE: cash_entries
  id INTEGER PRIMARY KEY AUTOINCREMENT
  type TEXT NOT NULL  -- 'in' | 'out'
  amount REAL NOT NULL
  category TEXT  -- 'sales' | 'purchase' | 'expense' | 'other'
  description TEXT
  date TEXT NOT NULL
  is_deleted INTEGER DEFAULT 0
  created_at TEXT DEFAULT (datetime('now'))

TABLE: products
  id INTEGER PRIMARY KEY AUTOINCREMENT
  name TEXT NOT NULL
  category TEXT NOT NULL  -- 'Fertilizer' | 'Pesticide' | 'Seed'
  notes TEXT
  supplier_name TEXT
  is_deleted INTEGER DEFAULT 0
  deleted_at TEXT
  created_at TEXT DEFAULT (datetime('now'))
  updated_at TEXT DEFAULT (datetime('now'))

TABLE: product_variants
  id INTEGER PRIMARY KEY AUTOINCREMENT
  product_id INTEGER NOT NULL REFERENCES products(id)
  size_label TEXT NOT NULL  -- e.g., "100ml", "1kg", "50kg Bag"
  unit TEXT NOT NULL        -- e.g., "Liter", "KG", "Bag"
  purchase_price REAL DEFAULT 0
  sale_price REAL DEFAULT 0
  stock_quantity REAL DEFAULT 0
  low_stock_threshold REAL DEFAULT 5
  is_deleted INTEGER DEFAULT 0
  created_at TEXT DEFAULT (datetime('now'))

TABLE: product_batches
  id INTEGER PRIMARY KEY AUTOINCREMENT
  variant_id INTEGER NOT NULL REFERENCES product_variants(id)
  quantity_remaining REAL NOT NULL
  purchase_price REAL NOT NULL
  expiry_date TEXT   -- NULL means no expiry
  received_date TEXT NOT NULL
  supplier_name TEXT
  is_exhausted INTEGER DEFAULT 0
  created_at TEXT DEFAULT (datetime('now'))

TABLE: stock_entries
  id INTEGER PRIMARY KEY AUTOINCREMENT
  variant_id INTEGER NOT NULL REFERENCES product_variants(id)
  type TEXT NOT NULL  -- 'in' | 'out'
  quantity REAL NOT NULL
  rate REAL
  amount REAL
  supplier_name TEXT
  reason TEXT    -- for stock out: 'sale'|'damaged'|'returned'|'other'
  notes TEXT
  expiry_date TEXT
  batch_id INTEGER REFERENCES product_batches(id)
  date TEXT NOT NULL
  created_at TEXT DEFAULT (datetime('now'))

TABLE: bills
  id INTEGER PRIMARY KEY AUTOINCREMENT
  bill_number TEXT NOT NULL UNIQUE  -- format: "MZM-001"
  customer_id INTEGER REFERENCES customers(id)
  subtotal REAL NOT NULL
  total_amount REAL NOT NULL
  paid_amount REAL DEFAULT 0
  balance_due REAL GENERATED ALWAYS AS (total_amount - paid_amount) VIRTUAL
  status TEXT DEFAULT 'unpaid'  -- 'unpaid' | 'partial' | 'paid'
  date TEXT NOT NULL
  notes TEXT
  is_deleted INTEGER DEFAULT 0
  deleted_at TEXT
  created_at TEXT DEFAULT (datetime('now'))

TABLE: bill_items
  id INTEGER PRIMARY KEY AUTOINCREMENT
  bill_id INTEGER NOT NULL REFERENCES bills(id)
  variant_id INTEGER REFERENCES product_variants(id)
  product_name TEXT NOT NULL  -- snapshot at time of sale
  size_label TEXT NOT NULL    -- snapshot at time of sale
  unit TEXT NOT NULL
  quantity REAL NOT NULL
  price REAL NOT NULL
  total REAL NOT NULL

TABLE: bill_payments
  id INTEGER PRIMARY KEY AUTOINCREMENT
  bill_id INTEGER NOT NULL REFERENCES bills(id)
  amount REAL NOT NULL
  date TEXT NOT NULL
  notes TEXT
  created_at TEXT DEFAULT (datetime('now'))

INDEXES TO CREATE:
  CREATE INDEX idx_transactions_customer ON transactions(customer_id);
  CREATE INDEX idx_transactions_date ON transactions(date);
  CREATE INDEX idx_transactions_deleted ON transactions(is_deleted);
  CREATE INDEX idx_product_variants_product ON product_variants(product_id);
  CREATE INDEX idx_product_batches_variant ON product_batches(variant_id);
  CREATE INDEX idx_stock_entries_variant ON stock_entries(variant_id);
  CREATE INDEX idx_bills_customer ON bills(customer_id);
  CREATE INDEX idx_bills_date ON bills(date);
  CREATE INDEX idx_bill_items_bill ON bill_items(bill_id);
  CREATE INDEX idx_bill_payments_bill ON bill_payments(bill_id);
  CREATE INDEX idx_customers_deleted ON customers(is_deleted);
  CREATE INDEX idx_products_deleted ON products(is_deleted);

DATA INTEGRITY RULES:
- ALL deletes are SOFT DELETES (set is_deleted=1, deleted_at=now)
- When transaction is deleted: REVERSE its effect on customer balance
- When bill is created: deduct stock from batches (FIFO) AND add credit transaction
- When payment added to bill: add payment transaction, update bill paid_amount, 
  update status (unpaid→partial→paid), reduce customer balance
- Balances must be updated ATOMICALLY in single transaction (BEGIN/COMMIT)
- Role check before EVERY mutation operation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 7 — ALL SCREENS SPECIFICATION (BUILD EVERY ONE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

════ SCREEN: HOME/DASHBOARD (app/(tabs)/index.tsx) ════

Header:
- Green gradient background
- Left: App name "MZM" small logo text
- Center: "ماہر زرعی مرکز" (Mahar Zarai Markaz)
- Right: notification bell icon + search icon

Daily Banner (show on first open each day):
- Gold background card
- "آج کی رپورٹ / Today's Summary"
- Rs. [total sales today] | [customers with pending]

Summary Stats Row (2×2 grid of StatCards):
- "لینے ہیں / To Receive": total outstanding (red amount)
- "دینے ہیں / To Give": total owed to suppliers (orange)
- "آج کی فروخت / Today's Sales": today's bill total (green)
- "نقد / Cash": cashbook balance (blue-green)

Quick Actions Row (horizontal scroll):
- Add Customer | Add Transaction | Create Bill | Stock In | Scanner
- Each: small circular icon button with label below

"حالیہ لین دین / Recent Transactions" section:
- Last 10 transactions across all customers
- Each row: Avatar | Customer Name | Description | Amount (colored) | Time
- "تمام دیکھیں / See All" → navigates to Khata tab

"کم اسٹاک / Low Stock Alert" section (only shows if any low stock):
- Horizontal scroll of product cards with red "LOW" badge
- Tap → Product detail

Empty state: Illustration + "پہلا گاہک شامل کریں / Add your first customer"

════ SCREEN: KHATA BOOK (app/(tabs)/khata.tsx) ════

Header:
- "کھاتہ بک / Khata Book"
- Right: search icon + add customer icon (Admin only)

Top Summary Bar:
- Two tabs: "لینے ہیں Rs.[X]" (green) | "دینے ہیں Rs.[X]" (red)
- Shows total amounts in each direction

Filter Chips (horizontal scroll):
- All | Customers | Suppliers | With Balance | Overdue (30+ days)

Search Bar:
- "نام یا نمبر / Name or number" placeholder
- Real-time filter as user types

Customer List (FlatList):
Each CustomerCard shows:
- Left: Avatar (colored circle with initials, 44px)
- Center-top: Customer name (16sp bold)
- Center-bottom: Phone number (12sp muted) + last transaction date
- Right-top: Balance amount (20sp bold, green if we owe them, red if they owe us)
- Right-bottom: "باقی / Due" or "ادا / Paid" label
- Swipe right: "یاد دہانی / Reminder" (gold)
- Swipe left: "ادائیگی / Payment" (green)

Sort options (bottom sheet from sort icon):
- نام (Name A-Z)
- رقم (Amount highest first)
- آخری تاریخ (Last transaction)
- تاریخ شمولیت (Date added)

FAB: + (Add Customer) — Admin only

Empty state: Illustration + "کوئی گاہک نہیں / No customers yet"

════ SCREEN: CUSTOMER DETAIL (app/customer/[id].tsx) ════

Header:
- Customer name as title
- Right: Edit icon (Admin) | More (3 dots)

Top Section (card):
- Large avatar (60px) + customer name + phone
- Call button (phone icon) | WhatsApp button
- City/Area (if entered)

Balance Card (prominent):
- Large balance amount (32sp bold)
- Color: red if they owe us, green if we owe them
- "باقی واجب الادا / Balance Due" label below
- Two quick action buttons: "اُدھار دیں / Give Credit" | "ادائیگی / Record Payment"

Transaction History:
Section header: "لین دین / Transactions" | Filter icon

Each TransactionRow:
- Left: type icon (arrow up=credit red, arrow down=payment green)
- Center: Description + date (DD/MM/YY)
- Right: Amount (red for credit, green for payment) + running balance below

"بل دیکھیں / View Bills" link if customer has bills

Action buttons at bottom:
- "بیان بھیجیں / Send Statement" (WhatsApp)
- "یاد دہانی / Send Reminder" (WhatsApp) — only if balance > 0

More menu (3 dots):
- Edit Customer (Admin only)
- Delete Customer → Recycle Bin (Admin only)
- Customer Statement
- View Bills

════ SCREEN: ADD CUSTOMER (app/add-customer.tsx) ════

Header: "نیا گاہک / New Customer" | Cancel (X right)

Form fields:
- نام* (Name): required, text
- موبائل نمبر (Phone): optional, numeric, "03XX-XXXXXXX"
- شہر/علاقہ (City/Area): optional, text
- شناختی کارڈ (CNIC): optional, "XXXXX-XXXXXXX-X" format
- نوٹ (Notes): optional, multiline
- قسم (Type): Customer | Supplier (segment control)
- ابتدائی بیلنس (Opening Balance): optional, numeric with Rs. prefix
  Subtitle: "پرانا قرضہ / Old outstanding amount"

Save button: full-width green gradient at bottom

════ SCREEN: ADD TRANSACTION (app/add-transaction.tsx) ════

Header: Customer name | Cancel

Type Selector (large segment at top):
- "اُدھار دیا / Gave Credit" (red background when selected)
- "ادائیگی لی / Got Payment" (green background when selected)

Amount field (large, center):
- "Rs." prefix, very large number input (32sp)
- Numeric keyboard opens immediately

Date field (below amount):
- Default: today
- Tap to open calendar picker
- "آج / Today" quick button

Description field:
- "وضاحت / Description (optional)"
- "کھاد، دوائی، ادائیگی وغیرہ"
- 100 char limit

Attach Image (optional):
- Camera icon to take photo of receipt/check

Preview of what will happen:
- "نیا بیلنس / New Balance: Rs. [calculated]"
- Green if improvement, red if worse

Save button: full-width at bottom

════ SCREEN: STOCK BOOK (app/(tabs)/stock.tsx) ════

Header: "اسٹاک بک / Stock Book" | search | add product

Top Stats Bar (horizontal scroll):
- کل مصنوعات / Total Products: [count]
- کل قیمت / Total Value: Rs. [sum]
- دستیاب / In Stock: [count]
- کم اسٹاک / Low Stock: [count] (warning color)
- ختم / Out of Stock: [count] (danger color)

Category Filter Chips:
- سب / All | کھاد / Fertilizer | دوائی / Pesticide | بیج / Seed

Search Bar: product name search

Product List:
Each ProductCard:
- Left: Category color dot (green=fertilizer, red=pesticide, yellow=seed)
- Center-top: Product name (bold)
- Center-bottom: All variants summary "3 sizes available"
- Right: Stock status badge (IN STOCK / LOW / OUT)
- Right-bottom: Total stock quantity across all variants
- Tap → Product Detail
- Swipe right: Quick "Stock In" 
- Swipe left: Quick "Stock Out"

FAB: + (Add Product) — Admin only

Sort options: A-Z | Low Stock First | Category

════ SCREEN: PRODUCT DETAIL (app/product/[id].tsx) ════

Header: Product name | Edit (Admin) | More

Category badge + supplier name (if any)

VARIANTS SECTION:
Title: "سائز/قسم / Sizes & Variants"
Each VariantCard:
- Size label (e.g., "100ml Bottle", "1kg Pack", "50kg Bag")
- Purchase price | Sale price | Profit margin %
- Stock quantity with unit (large, colored by status)
- Low stock threshold
- "اسٹاک ان / Stock In" quick button
- "اسٹاک آؤٹ / Stock Out" quick button
- Edit variant (Admin)

Add Variant button (Admin only)

BATCH/EXPIRY SECTION:
Title: "بیچ / Batches (Expiry Dates)"
For each active batch:
- Quantity remaining | Purchase price | Expiry date
- Status badge: FRESH (>30 days) | EXPIRING SOON (≤30 days) | EXPIRING VERY SOON (≤7 days) | EXPIRED

STOCK HISTORY section:
Last 20 movements with date, type (IN/OUT), quantity, running total

════ SCREEN: ADD PRODUCT (app/add-product.tsx) ════

Header: "نئی مصنوعات / New Product" | Cancel

Form:
- نام* (Product Name): required
- زمرہ* (Category): 
  Chips selector: کھاد/Fertilizer | دوائی/Pesticide | بیج/Seed
  Required, only one selectable
- سپلائر (Supplier): optional text
- نوٹ (Notes): optional

"+ ویریئنٹ شامل کریں / Add Variant" button appears after name entered
(at least 1 variant required to save)

Each variant section (expandable):
- سائز (Size Label): "100ml", "1kg", "50kg Bag" etc.
- اکائی (Unit): chips: KG | Liter | Bag | Box | Bottle | Packet | Gram | ML | Piece | Bundle
- خریدی قیمت (Purchase Price): Rs. prefix
- فروخت قیمت (Sale Price): Rs. prefix  
- منافع (Profit margin): auto-calculated and shown live in %
- موجودہ اسٹاک (Opening Stock): optional
- کم اسٹاک حد (Low Stock Alert): default 5

Can add multiple variants with the same "+" button

Save button at bottom

════ SCREEN: STOCK IN (app/stock-in.tsx) ════

Header: "اسٹاک ان / Stock In" | Cancel

Product selector (if not pre-selected):
- Search field with product list
- Shows product name + current stock

Variant selector:
- Horizontal chips showing all variants of selected product
- Shows current qty for each

Fields:
- مقدار* (Quantity): required, numeric
- خریدی قیمت (Purchase Rate): Rs. per unit
- کل رقم (Total): auto-calculated (read only)
- سپلائر (Supplier): optional
- میعاد ختم (Expiry Date): optional calendar picker
  "کیا یہ مصنوعات جلد خراب ہوتی ہے؟ / Does this product expire?"
- تاریخ (Date): default today
- نوٹ (Notes): optional

Preview: "نیا اسٹاک: [old] + [adding] = [new] [unit]"

Save → creates product_batch + stock_entry + updates variant stock_quantity

════ SCREEN: STOCK OUT (app/stock-out.tsx) ════

Similar to Stock In with:
- وجہ (Reason): chips: فروخت/Sale | خراب/Damaged | واپسی/Returned | دیگر/Other
- No expiry date
- Warning if quantity > available stock
- FIFO: automatically shows which batches will be consumed

════ SCREEN: BILLS LIST (app/(tabs)/bills.tsx) ════

Header: "بل بک / Bill Book" | search | + create bill

Monthly Summary Bar:
- "اس ماہ / This Month"
- کل فروخت / Total Sales: Rs. [amount]
- بل تعداد / Bills Count: [count]
- وصول / Collected: Rs. [paid amount]
- باقی / Pending: Rs. [unpaid amount]

Status Filter Tabs:
- سب/All | ادا نہیں/Unpaid | جزوی/Partial | ادا/Paid

Date Filter (chip): Today | This Week | This Month | Custom

Bill List:
Each BillCard:
- Top: Bill# (MZM-001) | Date | Status badge (colored)
- Middle: Customer name (or "نقد/Cash" if walk-in)
- Bottom: Rs.[total] | Paid: Rs.[paid] | Due: Rs.[due] (colored red)
- Tap → Bill Detail

FAB: + (Create Bill)

Empty state: "کوئی بل نہیں / No bills yet"

════ SCREEN: CREATE BILL (app/create-bill.tsx) ════

Multi-step wizard with progress bar at top (Steps 1/2/3)

STEP 1 — Customer Selection:
- "گاہک منتخب کریں / Select Customer"
- Search bar with customer list below
- Each customer: Name + current balance (colored)
- "+ نیا گاہک / New Customer" option at top of list
- "نقد فروخت / Cash Sale" option (no customer)
- Shows customer's current balance on selection
- Next → Step 2

STEP 2 — Add Products:
- Search bar: "مصنوعات تلاش کریں / Search products"
- Product search results show: Name | Size variants available | In-stock qty
- On product tap → show variant selector (bottom sheet)
  Each variant chip: "[size] - Rs.[price] | [qty] in stock"
- Added items list at bottom:
  Each item row: Product name | Size | Qty (- / number / +) | Price | Total | Remove
  Price is editable (tap to edit)
- Live total at bottom: "کل / Total: Rs. [sum]"
- Back | Next → Step 3

STEP 3 — Review & Confirm:
- Bill items table (read-only summary):
  Product | Size | Qty | Unit Price | Total
- Subtotal: Rs.[amount]
- Grand Total: Rs.[amount] (bold, large)
- ادائیگی / Payment section:
  "کتنا لیا؟ / Amount received now": Rs. input
  Balance Due: Rs.[remaining] (auto-calc, shown in red)
- نوٹ / Notes: optional text
- Preview of what happens:
  "اسٹاک کم ہوگا / Stock will deduct: [items]"
  "گاہک کا قرضہ / Customer balance increase: Rs.[due amount]"
- "بل محفوظ کریں / Save Bill" button (green gradient)

On Save:
1. Create bill record
2. Create bill_items records
3. Deduct stock from batches (FIFO) for each item
4. If customer selected: create credit transaction for due amount
5. If payment received: create bill_payment + payment transaction
6. Update customer balance
7. Navigate to Bill Detail screen

════ SCREEN: BILL DETAIL (app/bill/[id].tsx) ════

Header: "بل #MZM-[001]" | Share | More

Status badge (large, colored): UNPAID / PARTIAL / PAID

Customer section:
- Customer avatar + name + phone
- Current balance after this bill

Items Table:
Header row: # | مصنوعات | مقدار | قیمت | کل
Each item row: 1 | [Product Name] [Size] | [Qty] [Unit] | Rs.[price] | Rs.[total]
Subtotal row
Grand Total row (bold)

Payment History:
Title: "ادائیگیاں / Payments"
Each payment: Date | Rs.[amount] | Notes
"+ ادائیگی ریکارڈ کریں / Record Payment" button (Admin only)
  Opens Modal (NOT Alert.prompt) with amount input + notes + date

Summary:
- کل رقم / Total: Rs.[total] 
- ادا شدہ / Paid: Rs.[paid] (green)
- باقی / Due: Rs.[due] (red, large)

Bottom Action Buttons:
- "WhatsApp پر بھیجیں / Share on WhatsApp"
- "ادائیگی / Record Payment" (Admin only)

WhatsApp Message (exact format when shared):
```
*ماہر زرعی مرکز*
*Mahar Zarai Markaz*
Sargodha, Punjab
📞 +923452902229

━━━━━━━━━━━━━━━━━
بل نمبر / Bill #: MZM-[number]
تاریخ / Date: [DD/MM/YY]
گاہک / Customer: [name]
━━━━━━━━━━━━━━━━━

مصنوعات / Items:
• [product] [size] × [qty] @ Rs.[price]
  = Rs.[total]
• [product] [size] × [qty] @ Rs.[price]
  = Rs.[total]

━━━━━━━━━━━━━━━━━
کل / Total:     Rs.[amount]
ادا شدہ / Paid: Rs.[paid]
باقی / Due:    Rs.[due]
━━━━━━━━━━━━━━━━━

جزاک اللہ خیر 🌿
```

════ SCREEN: REPORTS MENU (app/reports/index.tsx) ════

Header: "رپورٹس / Reports"

Report cards (tappable):
1. 📊 یومیہ خلاصہ / Daily Summary — "آج کی فروخت اور لین دین"
2. 💰 باقیات / Outstanding — "کس کا کتنا باقی ہے"
3. 📦 اسٹاک رپورٹ / Stock Report — "مصنوعات اور قیمت"
4. 📅 ماہانہ فروخت / Monthly Sales — "مہینے کا جائزہ"
5. 📈 نفع و نقصان / Profit & Loss — "آمدن اور منافع"
6. 📋 گاہک کھاتہ / Customer Ledger — "ایک گاہک کی مکمل تاریخ"

"نیلی رپورٹ بھیجیں / Send Daily Report" button:
- Sends today's summary to owner's WhatsApp (+923452902229)
- Gold button, prominent

════ SCREEN: DAILY SUMMARY REPORT (app/reports/daily.tsx) ════

Date selector (left/right arrows, default today):
"◄ کل | آج ►"

Stats Cards:
- آج کی فروخت / Today's Sales: Rs.[total bills today]
- بل تعداد / Bills Count: [count]
- وصول / Collected: Rs.[payments received today]
- نئے گاہک / New Customers: [count added today]

Transactions list for selected day:
Each row: Time | Customer | Type | Amount

Stock Movements for selected day:
Products added/deducted today

WhatsApp Share button: sends formatted report message

════ SCREEN: OUTSTANDING REPORT (app/reports/outstanding.tsx) ════

Header: "باقیات / Outstanding Balances"

Total outstanding (large, red): Rs.[total]
Customer count with balance

Sorted list (highest balance first):
Each row:
- Avatar + Customer name
- Phone number
- Days since last transaction (red badge if >30 days)
- Balance amount (red, bold)

Filter: All | Overdue 30+ days

WhatsApp share: sends full list

════ SCREEN: STOCK REPORT (app/reports/stock.tsx) ════

Total inventory value (large): Rs.[sum of qty × purchase_price]

Category breakdown chips: All | Fertilizer | Pesticide | Seed

Product list with:
- Name + category
- Qty per variant
- Stock value (qty × purchase_price)
- Status badge (IN/LOW/OUT)

"ختم ہونے والی / Expiring Soon" section at top if any batches expiring

════ SCREEN: PROFIT & LOSS (app/reports/profit.tsx) ════

Date range selector: This Month | Last Month | Custom

Revenue: Rs.[total bill amounts in period] (green)
Cost of Goods: Rs.[sum of qty×purchase_price for items sold] (red)
Gross Profit: Rs.[revenue - cost] (large, colored)
Profit Margin: [X]%

Bar chart: daily profit over the period

Top selling products in period

════ SCREEN: CUSTOMER LEDGER REPORT (app/reports/customer-ledger.tsx) ════

Customer selector (search to pick one)
Date range selector

Customer info: name, phone, type

Summary:
- ابتدائی بیلنس / Opening Balance
- کل اُدھار / Total Credit given
- کل ادائیگی / Total Payments received
- اختتامی بیلنس / Closing Balance

Transaction table:
Date | Description | Udhar | Payment | Balance

WhatsApp share button:
Sends formatted statement

════ SCREEN: MORE (app/(tabs)/more.tsx) ════

Header: "مزید / More"

Profile Card (green gradient):
- Shop name: "ماہر زرعی مرکز"
- Owner: Muhammad Mahad Amjad
- Location: Sargodha, Punjab
- Phone: +923452902229
- Role badge: ADMIN (green shield) or VIEWER (gray eye)

Quick Stats Row: Today's Sales | Total Customers | Total Products

Section: رپورٹس / Reports
- All 6 report links

Section: ترتیبات / Settings
- WhatsApp Reminder (toggle + settings)
- زبان / Language
- بیک اپ / Backup & Restore
- نمبر تبدیل کریں / Change Phone Number
- ردی ٹوکری / Recycle Bin

Section: دیگر / Other
- ایپ کے بارے میں / About App
- مدد / Help

Logout button (red, at bottom, with confirmation)

════ SCREEN: RECYCLE BIN (app/recycle-bin.tsx) ════

Header: "ردی ٹوکری / Recycle Bin" | Empty All (Admin)

Tabs: Customers | Products

Deleted items list:
Each row:
- Name + deletion date
- "بحال کریں / Restore" button (green)
- "مستقل حذف / Delete Permanently" button (red) — Admin only

Restore: removes is_deleted flag, restores with all history
Delete Permanently: removes from DB completely — requires confirmation dialog

════ SCREEN: AI NOTEBOOK SCANNER (app/scanner.tsx) ════

Header: "نوٹ بک اسکینر / Notebook Scanner"

Instructions card:
"اپنی ہاتھ سے لکھی کھاتہ بک کی تصویر لیں اور ہم باقی کام کریں گے"
"Take a photo of your handwritten khata book and we'll do the rest"

Step 1 card: "📷 تصویر لیں / Capture Page"
- "کیمرہ کھولیں / Open Camera" button
- "گیلری سے / From Gallery" button
- Preview of captured image (after capture)

Step 2 card: "🤖 AI تجزیہ / AI Processing" (shows after capture)
- Animated processing indicator
- "Gemini AI آپ کی لکھائی پڑھ رہا ہے..."
- "Reading your Urdu handwriting..."

Step 3 card: "✅ تصدیق کریں / Review & Confirm" (after processing)
- "X اندراج ملے / X entries found"
- "جائزہ لیں / Review Now" button → navigate to scan-review screen

Information section:
"کیسے لکھیں / What handwriting we can read:"
- تاریخ مع رقم اور نام والی اندراج (Date + amount + name entries)
- بنام [نام] کے بعد رقم (Amount after بنام [name])
- اُدھار کی رقم بائیں کالم میں (Credit amounts in left column)

════ SCREEN: SCAN REVIEW (app/scan-review.tsx) ════

Header: "جائزہ اور تصدیق / Review & Confirm" | Import (X selected)

Instructions: "تبدیل کریں اور پھر درآمد کریں / Edit entries then import"

Select All / Deselect All

Entry List:
Each EntryCard:
- Checkbox (checked by default)
- Date field (from AI, editable)
- Customer field:
  - AI extracted name shown
  - Below: matched customer (if found with >70% confidence): "✓ ملا: [Customer Name]"
  - If 40-70%: "⚠ ممکنہ: [Customer Name] (تصدیق کریں / Confirm?)"
  - If <40%: "نیا گاہک بنائیں / New Customer"
  - Tap to change customer (opens customer search)
- Amount: Rs. [amount] (editable)
- Type: اُدھار/Credit | ادائیگی/Payment | واپسی/Return (segment)
- Description: AI extracted product info (editable)

"[X] اندراج درآمد کریں / Import [X] Entries" button at bottom

On Import:
- Creates transactions for checked entries
- Creates new customers for entries without match
- Shows success animation with count
- Navigate back to Khata tab

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 8 — CASHBOOK (DigiKhata Feature — Include Fully)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add CashBook as 6th tab OR as section in More tab:
"نقد بک / CashBook"

Daily Cash Tracking:
- Opening balance for today
- All cash ins and outs
- Closing balance

Cash In categories: Sales Income | Other Income
Cash Out categories: Purchase | Expense | Salary | Other

Day navigation: ◄ Yesterday | Today ►

Summary: کل داخل / Total In: Rs.[X] | کل خرچ / Total Out: Rs.[X] | خالص / Net: Rs.[X]

Entry list for selected day with + FAB

Monthly view toggle

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 9 — AI SCANNER TECHNICAL IMPLEMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: utils/gemini.ts

API: Gemini 1.5 Flash
API Key: Store in environment variable EXPO_PUBLIC_GEMINI_API_KEY
Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent

Function: scanNotebookPage(imageBase64: string, mimeType: string)

System prompt to send with image:
```
You are reading a Pakistani agricultural shop's handwritten Urdu ledger notebook.

NOTEBOOK FORMAT:
- Organized by DATE (written in red, format DD-MM-YY)
- Day name in Urdu follows each date (پیر Monday, منگل Tuesday, بدھ Wednesday, 
  جمعرات Thursday, جمعہ Friday, ہفتہ Saturday, اتوار Sunday)
- Each entry has circled numbers ①②③ = quantity of that product
- "بنام" (bi-naam) = "credited to / for" → the customer name follows
- Products are written in local Urdu/abbreviated names
- Left column (ادھار) = credit amounts given (in PKR)
- Right column = payment amounts received
- Checkmark ✓ = verified/closed entry
- "واپس" = returned item (reverse the amount)

EXAMPLES:
"① ودلمر ① البشا بنام نواز مدرسی ۔۔۔ 1700"
→ {customer:"Nawaz Madrasi", amount:1700, type:"credit", desc:"Volmer + AlBasha pesticides"}

"② SOP 25 کلو بنام شریف ۔۔۔ 19000"
→ {customer:"Sharif", amount:19000, type:"credit", desc:"2x25kg SOP Fertilizer"}

"① 10 کلو SOP فسی ۔۔۔ 3000 | 1000"
→ Two entries: {customer:"Fasi",amount:3000,type:"credit"} and {customer:"Fasi",amount:1000,type:"payment"}

Extract ALL entries from the image and return ONLY this JSON:
{
  "entries": [
    {
      "date": "DD-MM-YY or null",
      "customer_name": "name as written",
      "amount": 0,
      "type": "credit or payment or return",
      "description": "products/other info"
    }
  ]
}

Rules:
- If date appears on page, use it for all entries until next date
- If amount is in left column: type="credit"
- If amount is in right column: type="payment"
- If "واپس" appears: type="return"
- Return ONLY valid JSON. No explanations.
```

Parse response and return array of entries.

File: utils/fuzzy.ts

Function: fuzzyMatch(extractedName: string, existingCustomers: Customer[])
Returns: {customer: Customer | null, confidence: number, suggestions: Customer[]}

Algorithm:
1. Normalize both strings: lowercase, remove extra spaces, remove diacritics
2. Check if extracted IS a substring of any customer name → confidence 85%
3. Check if any customer name IS a substring of extracted → confidence 80%
4. Calculate Levenshtein distance for each customer
5. Convert distance to confidence: (1 - distance/maxLen) * 100
6. Return highest confidence match
7. Threshold: >70% = auto-match, 40-70% = suggest, <40% = new customer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 10 — WHATSAPP INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: utils/whatsapp.ts

Function: sendWhatsApp(phone: string, message: string)
- Format phone: remove +, leading 0, add 92: "03001234567" → "923001234567"
- URL: `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`
- Use Linking.canOpenURL first, fallback to web.whatsapp.com

REMINDER MESSAGE (exact format):
```
السلام علیکم *[Customer Name]* بھائی/صاحب،

*ماہر زرعی مرکز* کی طرف سے یاد دہانی:

آپ کا باقی: *Rs. [balance]*
آخری تاریخ: [last transaction date]

جلد ادائیگی فرمائیں۔ شکریہ 🌿
📞 +923452902229
```

DAILY REPORT MESSAGE (sent to owner: +923452902229):
```
*ماہر زرعی مرکز - یومیہ رپورٹ*
تاریخ: [DD/MM/YY]

━━━━━━━━━━━━━
آج کی فروخت: Rs. [amount]
بل تعداد: [count]
وصول: Rs. [collected]

باقیدار گاہک: [count]
کل باقیات: Rs. [total outstanding]

آج قرضہ بڑھا: [count] گاہک
━━━━━━━━━━━━━
Mahar Zarai Markaz 🌾
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 11 — BUSINESS LOGIC (CRITICAL — IMPLEMENT EXACTLY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUSTOMER BALANCE:
- Credit (we gave them goods): balance INCREASES (they owe us more)
- Payment (they paid us): balance DECREASES
- current_balance > 0: THEY OWE US (show in red — "لینا ہے")
- current_balance < 0: WE OWE THEM (show in green — "دینا ہے")
- current_balance = 0: CLEAR

BALANCE UPDATE FORMULA (atomic — in single DB transaction):
  On Credit: customer.current_balance += amount
  On Payment: customer.current_balance -= amount
  On Delete Credit: customer.current_balance -= amount (reverse)
  On Delete Payment: customer.current_balance += amount (reverse)

FIFO BATCH CONSUMPTION (for stock out and bill creation):
```
function deductFIFO(variantId, quantityNeeded):
  batches = SELECT * FROM product_batches 
    WHERE variant_id = variantId AND is_exhausted = 0 
    ORDER BY received_date ASC, id ASC
  
  remaining = quantityNeeded
  for batch in batches:
    if remaining <= 0: break
    deduct = MIN(batch.quantity_remaining, remaining)
    batch.quantity_remaining -= deduct
    remaining -= deduct
    if batch.quantity_remaining == 0:
      batch.is_exhausted = 1
  
  if remaining > 0:
    show warning "اسٹاک کم ہے / Insufficient stock"
    but allow override (save anyway with negative stock)
```

BILL CREATION (atomic operation):
```
BEGIN TRANSACTION:
1. INSERT into bills
2. For each item:
   a. INSERT into bill_items
   b. Deduct from product_batches (FIFO)
   c. UPDATE product_variants.stock_quantity -= qty
   d. INSERT into stock_entries (type='out', reason='sale')
3. If customer selected AND balance_due > 0:
   a. INSERT into transactions (type='credit', amount=balance_due)
   b. UPDATE customers.current_balance += balance_due
4. If payment_received > 0:
   a. INSERT into bill_payments
   b. INSERT into transactions (type='payment', amount=payment_received)
   c. UPDATE customers.current_balance -= payment_received
5. UPDATE bills.paid_amount, bills.status
COMMIT
```

BILL STATUS:
- paid_amount = 0: 'unpaid'
- 0 < paid_amount < total_amount: 'partial'
- paid_amount >= total_amount: 'paid'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 12 — SEED DATA SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

data/customers.ts:
```typescript
export const SEED_CUSTOMERS: {
  name: string;
  phone?: string;
  type: 'customer' | 'supplier';
  opening_balance?: number;
  city?: string;
}[] = []; // Will be populated with real 119 customers later
```

data/products.ts:
```typescript
export const SEED_PRODUCTS: {
  name: string;
  category: 'Fertilizer' | 'Pesticide' | 'Seed';
  supplier_name?: string;
  variants: {
    size_label: string;
    unit: string;
    purchase_price: number;
    sale_price: number;
    opening_stock?: number;
  }[];
}[] = []; // Will be populated with real 170+ products later
```

Seeding logic in _layout.tsx:
- Check settings table: key='seeded', value='true'
- If not seeded AND arrays have data: run seed
- Mark seeded after completion
- Never re-seed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 13 — BUILD PHASE ORDER (BUILD EXACTLY IN THIS ORDER)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 1 — Foundation & Design System
- Project setup with all packages
- constants/colors.ts, constants/theme.ts, constants/strings.ts
- All UI components in components/ui/ (all 15 components)
- Database schema — all tables and indexes
- Database helper functions in database/index.ts
- AuthContext.tsx
- Root _layout.tsx with DB init and auth check
- Show me PHASE 1 COMPLETE before moving on

PHASE 2 — Onboarding & Login
- Splash screen with proper branding
- 3 welcome slides
- Language selection
- Phone number entry
- OTP verification (mock OTP: always 123456 in dev)
- Business setup screen
- Biometric setup prompt
- Full navigation flow working end-to-end
- Show me PHASE 2 COMPLETE before moving on

PHASE 3 — Customer Khata (Core Feature)
- Home/Dashboard screen with stats
- Khata tab with customer list, search, filter, sort
- Customer detail screen with transaction history
- Add Customer screen (all fields)
- Add Transaction screen (credit and payment)
- Customer balance logic (atomic updates)
- Swipe actions on customer list
- Soft delete → Recycle Bin
- Show me PHASE 3 COMPLETE before moving on

PHASE 4 — Stock Book
- Stock tab with product list, search, filter, category chips
- Product detail with variants and batches
- Add Product screen with variants
- Add Variant screen
- Stock In with batch/expiry tracking
- Stock Out with FIFO deduction
- Low stock badges and alerts
- Expiry date warnings
- Show me PHASE 4 COMPLETE before moving on

PHASE 5 — Bills System
- Bills tab with list, filters, stats
- Create Bill wizard (3 steps)
- Bill detail with items table
- Record payment modal
- Multiple payments per bill
- WhatsApp bill sharing (formatted message)
- Auto stock deduction on bill creation
- Auto customer balance update
- Show me PHASE 5 COMPLETE before moving on

PHASE 6 — Reports
- Reports menu screen
- Daily Summary report
- Outstanding Balances report
- Stock Value report
- Monthly Sales report
- Profit & Loss report
- Customer Ledger report
- WhatsApp share for all reports
- Daily report send to owner button
- Show me PHASE 6 COMPLETE before moving on

PHASE 7 — AI Scanner + More Screen
- More tab (profile card, all sections)
- WhatsApp reminder system
- CashBook (cash in/out tracking)
- Recycle Bin (restore/delete permanently)
- Settings screens
- AI Notebook Scanner (camera + Gemini)
- Scan Review screen with fuzzy matching
- Show me PHASE 7 COMPLETE before moving on

PHASE 8 — Polish & Testing
- Full e2e testing of every flow
- Fix any UI inconsistencies
- Performance optimization
- Ensure all screens work on Android
- Ensure web fallbacks work
- Final review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 14 — TEST CHECKLIST (TEST EVERY ITEM AFTER BUILDING)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] OTP login flow end-to-end (enter 123456 in dev)
[ ] Welcome slides and skip button
[ ] Language selection persists
[ ] Add customer (all fields, required validation)
[ ] Customer appears in list immediately
[ ] Add credit → balance increases (correct direction)
[ ] Add payment → balance decreases
[ ] Delete transaction → balance reverses correctly
[ ] Customer search by name works
[ ] Customer search by phone works
[ ] Swipe right on customer → reminder WhatsApp opens
[ ] Swipe left on customer → payment screen opens
[ ] Add product with 3 variants
[ ] Stock In → variant quantity increases
[ ] Stock In with expiry date → batch created
[ ] Stock Out → FIFO deduction from oldest batch
[ ] Stock Out insufficient → warning shown
[ ] Low stock badge appears at threshold
[ ] Expiry warning badges (30 days and 7 days)
[ ] Create bill with 2 products → stock deducted
[ ] Create bill → customer balance increases for unpaid amount
[ ] Record partial payment on bill → status becomes "partial"
[ ] Record full payment → status becomes "paid"
[ ] Customer balance decreases on payment
[ ] WhatsApp bill share → correct formatted message
[ ] All 6 reports load with correct data
[ ] Daily report WhatsApp send button works
[ ] Soft delete customer → appears in Recycle Bin
[ ] Restore customer → appears back in list with history
[ ] Permanently delete → confirmation required → deleted
[ ] Viewer role → all edit/add/delete buttons hidden
[ ] Admin role → all buttons visible
[ ] Scanner screen opens camera
[ ] Scan review shows entries for editing
[ ] Import entries → transactions created
[ ] All screens scroll without cutting off bottom content
[ ] Portrait and landscape both work
[ ] App works on web (no SQLite errors)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 15 — FINAL DELIVERY REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deliver a complete, working Expo React Native app that:
✅ Runs on Android without any errors
✅ Runs on Web browser with proper fallbacks
✅ All 40+ screens fully implemented and navigable
✅ Complete SQLite database with all CRUD operations
✅ Premium agricultural UI (deep green + gold, beautiful cards, gradients)
✅ Bilingual: English and Urdu labels throughout
✅ Complete DigiKhata feature clone (khata, stock, bills, cashbook, reports)
✅ Custom features: variants, FIFO batches, AI scanner, WhatsApp reminders
✅ Full test coverage confirming all 44 checklist items pass
✅ Clean TypeScript code, well organized, no console errors
✅ replit.md with full architecture documentation

AFTER EACH PHASE: show summary of what was built + ask for confirmation.
DO NOT rush. DO NOT skip phases. BUILD IT PERFECTLY.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*This prompt created for: Mahar Zarai Markaz, Sargodha | March 2026*
*Owner: Muhammad Mahad Amjad | +923452902229*
