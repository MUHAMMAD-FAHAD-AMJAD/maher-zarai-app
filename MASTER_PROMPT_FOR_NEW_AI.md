# MASTER PROMPT — FOR NEW AI MODEL
# Build: Mahar Zarai Markaz Mobile App
# Based on: Full DigiKhata Clone + Custom Features

---

## STEP 1 — RESEARCH PROMPT (Give this to Perplexity AI first)

```
Do a complete and extremely deep research on the DigiKhata mobile app (Pakistani khata/ledger app). 
I want you to find and document EVERY single screen, EVERY button, EVERY feature, EVERY flow, 
EVERY minor detail of the entire DigiKhata Android app. Include:

1. Every screen name and what it shows
2. Every button on every screen and what it does
3. Complete navigation flow (how you go from screen to screen)
4. Customer/Khata management — every detail
5. Supplier management — every detail  
6. Transaction recording — every type, every field
7. Stock/inventory management — every detail
8. Bill creation — every step, every field
9. Reports — every report type and what data it shows
10. Settings — every setting option
11. Backup and restore — how it works
12. Dashboard — every widget, every number shown
13. Search functionality — how it works on each screen
14. Notifications — every type of notification
15. Sharing features — WhatsApp, PDF, etc.
16. The visual design — colors, layout, fonts used
17. Any premium/paid features vs free features
18. Any unique Pakistani-specific features

Search DigiKhata app reviews on Google Play Store, YouTube tutorials, Reddit, blog posts, 
screenshots, and any other source. Give me the most complete picture possible of every 
single thing inside this app. Do not skip anything.
```

---

## STEP 2 — FULL BUILD PROMPT (Give this to Claude or ChatGPT-4o after getting research)

```
You are building a complete premium Android mobile app from scratch. This app is called 
"Mahar Zarai Markaz" — a business management app for an agricultural and pesticide shop.

READ EVERY WORD OF THIS PROMPT CAREFULLY. DO NOT ASK ME ANY QUESTIONS. 
BUILD EVERYTHING EXACTLY AS DESCRIBED BELOW.

═══════════════════════════════════════════════════════════════
PART 1 — WHAT YOU ARE BUILDING
═══════════════════════════════════════════════════════════════

You are building a DigiKhata CLONE — meaning copy every single feature, every screen, 
every button, every flow of DigiKhata exactly. Then on top of that, add the custom 
features described in PART 4 of this prompt.

DigiKhata is a Pakistani khata/ledger app. Research it completely before building. 
Clone it 100% and then customize it for this specific shop.

═══════════════════════════════════════════════════════════════
PART 2 — SHOP INFORMATION
═══════════════════════════════════════════════════════════════

Shop Name:         Mahar Zarai Markaz (ماہر زرعی مرکز)
Shop Type:         Agricultural & Pesticide Shop (زرعی دکان)
Location:          Sargodha, Punjab, Pakistan
Phone Number:      +923452902229  (used for customer calls AND for bill sharing)
Owner Name:        Muhammad Mahad Amjad
No shop logo:      Do NOT add any logo. Use text/icon based branding only.
Target Users:      Non-technical users — shop owners and farmers in Pakistan
Target Devices:    Infinix and Tecno Android phones (mid-range, 720p-1080p screens)
Language:          Bilingual — both Urdu and English throughout the app

═══════════════════════════════════════════════════════════════
PART 3 — TECHNOLOGY STACK (USE EXACTLY THIS)
═══════════════════════════════════════════════════════════════

Framework:        Expo React Native (latest SDK)
Language:         TypeScript
Navigation:       expo-router (file-based routing)
Database:         expo-sqlite (local SQLite — offline first, zero monthly cost)
UI:               Custom built (no third party UI library)
Gradients:        expo-linear-gradient
Icons:            @expo/vector-icons (Feather + MaterialCommunityIcons)
Fonts:            @expo-google-fonts/inter (4 weights)
Auth:             OTP-based (see PART 4 for details)
State:            React Context + @tanstack/react-query
Gestures:         react-native-gesture-handler
Safe Areas:       react-native-safe-area-context
Biometric:        expo-local-authentication (conditional import — web safe)
Camera:           expo-image-picker (conditional import — web safe)
Haptics:          expo-haptics
Blur:             expo-blur

CRITICAL RULES FOR WEB COMPATIBILITY:
- All expo-sqlite imports MUST be conditional: if (Platform.OS !== 'web') use SQLite, 
  else use in-memory arrays
- expo-local-authentication MUST be conditionally required (not statically imported)
- expo-image-picker MUST be conditionally required (not statically imported)  
- NEVER use Alert.prompt() — it is iOS only. Always use custom Modal with TextInput
- Share.share() must be guarded: web uses navigator.clipboard instead
- Tab bar uses BlurView on iOS only, plain white on Android and web

═══════════════════════════════════════════════════════════════
PART 4 — AUTHENTICATION SYSTEM (OTP-BASED — CUSTOM, NOT DIGIKAHTA)
═══════════════════════════════════════════════════════════════

DO NOT use PIN-based login. DO NOT use email/password. 
Use OTP (One-Time Password) based authentication:

HOW IT WORKS:
1. User opens app for the first time
2. Enters their Pakistani mobile number (03XX format)
3. OTP is sent via WhatsApp message OR SMS to that number
4. User enters the 6-digit OTP
5. User is logged in AND all their previous data is automatically restored
6. This means: Authentication = Data Backup/Restore are ONE SYSTEM

OTP DELIVERY: Use WhatsApp Business API OR Twilio SMS (whichever is easier)
If neither is set up yet, build the UI completely and use a placeholder/mock OTP 
service that can be replaced later. Show the OTP in console/logs during development.

TWO ROLES:
- ADMIN: 
  * Full access to everything
  * Can add, edit, delete all data
  * Can see all reports  
  * Can change settings
  * Can manage other users
  
- VIEWER:
  * Can see EVERYTHING the admin sees
  * Same UI, same screens, same data visibility
  * CANNOT add, edit, or delete ANYTHING
  * CANNOT access settings
  * All "add/edit/delete" buttons are hidden or disabled for viewer

BIOMETRIC LOGIN:
- After first OTP login, user can enable fingerprint login
- Biometric login only available if user has done OTP login at least once before
- Biometric inherits the last used role (admin or viewer)
- Conditional import — only on Android/iOS, not web

DATA STORAGE FOR OTP SYSTEM:
- All data stored locally in SQLite on the device
- When user does OTP login on a NEW device: pull their backup from cloud (Google Drive 
  or a simple backend) and restore everything
- Design this as a modular system so the cloud storage method can be swapped later

NO AUTO-LOCK. NO PASSCODE SCREEN. NO SESSION TIMEOUT.

═══════════════════════════════════════════════════════════════
PART 5 — COMPLETE DIGIKAHTA CLONE FEATURES
═══════════════════════════════════════════════════════════════

Clone every single feature of DigiKhata exactly. Based on complete research of DigiKhata,
implement ALL of the following (and anything else DigiKhata has that is not listed here):

--- 5A. DASHBOARD ---
- Summary cards: Total money to receive (باقی لینا ہے), Total money to give (باقی دینا ہے)
- Net balance indicator
- Recent transactions list
- Quick action buttons (Add Customer, Add Supplier, Create Bill)
- Search bar to search customers/suppliers from dashboard
- Notification bell icon
- Profile/account icon

--- 5B. KHATA BOOK (CUSTOMER LEDGER) ---
- List of all customers with their outstanding balance
- Each customer shows: name, phone, balance (red if they owe us, green if we owe them)
- Customer avatar with colored initial letter (color based on name hash)
- Sort options: by name A-Z, by amount highest first, by recently active
- Filter: All / Customers / Suppliers
- Search: real-time search by name OR phone number
- Total "to receive" and "to give" summary at top
- Pull to refresh
- FAB button to add new customer (Admin only)

--- 5C. CUSTOMER DETAIL SCREEN ---
- Customer name, phone, type (customer/supplier)
- Current balance prominently displayed (large, color coded)
- CITY/AREA field (optional, not compulsory)  
- CNIC field (optional, not compulsory)
- Notes field
- "Call" button (opens phone dialer)
- "WhatsApp" button (opens WhatsApp chat with this customer)
- Transaction history list (newest first)
  - Each entry: date, description, amount, type (credit/payment), running balance
- "Add Credit/Udhar" button  
- "Record Payment" button
- "Edit Customer" button (Admin only)
- "Delete Customer" button — soft delete, goes to Recycle Bin (Admin only)
- "Send Statement" button — sends customer's account statement via WhatsApp
- WhatsApp PAYMENT REMINDER button — sends reminder message if balance > 0

--- 5D. ADD CUSTOMER SCREEN ---
Fields:
- Customer Name (required)
- Phone Number (optional but strongly suggested)
- Type toggle: Customer OR Supplier
- Opening Balance (how much they already owed from old records — optional, default 0)
- City/Area (optional)
- CNIC number (optional)
- Notes (optional)

--- 5E. ADD TRANSACTION SCREEN ---
Two transaction types:
1. CREDIT (اُدھار دیا): Customer took goods/cash on credit — their balance increases
2. PAYMENT (ادائیگی): Customer paid money — their balance decreases

Fields:
- Amount (required, numeric, in Rs.)
- Date (default today, can change to past date)
- Description/Note (optional — e.g., "fertilizer", "cash payment")
- Image attachment (optional — photo of receipt or check)

After saving: instantly shows new balance, updates dashboard totals

--- 5F. STOCK BOOK (INVENTORY) ---
Dashboard stats:
- Total products count
- Total inventory value (sum of stock_qty × purchase_price for all products)
- In Stock count (quantity > threshold)
- Low Stock count (quantity <= threshold but > 0)
- Out of Stock count (quantity = 0)

Product list:
- Product name
- Category badge (color coded)
- Current stock quantity + unit
- Stock status badge: IN STOCK (green) / LOW (yellow) / OUT (red)
- Quick "Stock In" and "Stock Out" buttons on each card
- Category filter chips: All / Fertilizer / Pesticide / Seed
- Search products by name
- Sort: by name, by stock level, by category

--- 5G. PRODUCT DETAIL SCREEN ---
- Product name, category, unit
- Current stock quantity
- Purchase price, Sale price, Profit margin %
- Low stock threshold setting
- Expiry date tracking per batch (see PART 6 for details)
- Supplier info (optional)
- Stock history log (all entries and exits)
- Edit product button (Admin only)
- Delete product button — soft delete (Admin only)

--- 5H. ADD PRODUCT SCREEN ---
Fields:
- Product Name (required)
- Category: Fertilizer / Pesticide / Seed (chips selector, required)
- Unit: KG / Liter / Bag / Box / Piece / Bundle / Bottle / Can / Packet / Gram / ML 
  (horizontal scrollable chips, required)
- Opening Stock Quantity (optional, default 0)
- Purchase Price per unit in Rs. (optional)
- Sale Price per unit in Rs. (optional)
- Live Profit Margin % shown: ((sale - purchase) / purchase × 100)
- Low Stock Alert Threshold (default 5)
- Supplier name/link (optional)
- Notes (optional)

--- 5I. STOCK IN / STOCK OUT SCREEN ---
Stock In (received inventory):
- Product search and select
- Quantity received
- Purchase rate per unit at time of receipt
- Total amount auto-calculated
- Supplier (optional)
- Date (default today)
- Expiry date of this batch (optional — see PART 6)
- Notes

Stock Out (manual removal):
- Product search and select  
- Quantity removed
- Reason: Sale / Damaged / Returned to Supplier / Other
- Date

Both automatically update product stock quantity.

--- 5J. BILLS / INVOICES ---
Bill List screen:
- Monthly summary: Total Sales, Total Bills Count, Total Payments Collected
- Status filter tabs: All / Unpaid / Partial / Paid
- Each bill card: Bill# , Customer name, Date, Amount, Status badge
- Search bills by customer name or bill number

Create Bill screen:
- Step 1: Select Customer (search, optional — can make walk-in bill without customer)
- Step 2: Add Products
  * Search products by name
  * Select product variant/size
  * Enter quantity
  * Price auto-filled from catalog (editable)
  * Line total auto-calculated (qty × price)
  * Multiple products can be added
  * Remove any line item
- Step 3: Review
  * Itemized list
  * Subtotal
  * Grand Total
  * Notes field
- Step 4: Confirm
  * Creates bill record
  * Deducts stock for each product automatically
  * Creates credit transaction in customer's ledger automatically
  * Assigns sequential bill number

Bill Detail screen:
- Bill number and date
- Customer info
- Items table: Product | Qty | Unit | Price | Total
- Subtotal, Grand Total
- Amount Paid (green), Balance Due (red)
- "Record Payment" button → custom Modal (NOT Alert.prompt) to enter payment amount
- "Share Bill on WhatsApp" button → formatted WhatsApp message with bill details
  Message format:
  ```
  *Mahar Zarai Markaz*
  Sargodha, Punjab
  📞 +923452902229
  
  Bill #[number]
  Date: [date]
  Customer: [name]
  
  Items:
  • [product] × [qty] @ Rs.[price] = Rs.[total]
  • [product] × [qty] @ Rs.[price] = Rs.[total]
  
  Subtotal: Rs.[amount]
  *Total: Rs.[amount]*
  Paid: Rs.[amount]
  *Balance Due: Rs.[amount]*
  
  JazakAllah Khair 🌿
  ```

Payments: A single bill CAN receive multiple payments over time (partial payments)

--- 5K. REPORTS ---
All reports screen with these report types:

1. DAILY SUMMARY REPORT
   - Date selector (default today)
   - Total sales for that day
   - Number of bills created
   - List of all transactions that day
   - Cash collected (payments received)
   - Which products went out (stock movement)

2. CUSTOMER OUTSTANDING REPORT
   - List of ALL customers with unpaid balances
   - Sorted by amount (highest first)
   - Total outstanding amount at top
   - How many days since last payment for each
   - Shareable on WhatsApp

3. STOCK VALUE REPORT
   - All products with current quantity
   - Purchase price × quantity = stock value per product
   - Total inventory value
   - Low stock items highlighted
   - Out of stock items highlighted

4. MONTHLY SALES REPORT
   - Month selector
   - Total sales by month
   - Day-by-day breakdown
   - Top selling products
   - Top customers by purchase amount

5. PROFIT & LOSS REPORT
   - Total Sales Revenue
   - Total Cost of Goods Sold (purchase price × units sold)
   - Gross Profit = Revenue - Cost
   - Profit Margin %

6. CUSTOMER LEDGER REPORT (per customer)
   - Full transaction history for one customer
   - Date range filter
   - Opening balance, all credits, all payments, closing balance
   - Shareable as WhatsApp message

AUTO-NOTIFICATION SYSTEM:
- When app is opened each day → show a summary notification/banner:
  "Today: Rs.[X] sales | Outstanding: Rs.[Y] due from [Z] customers"
- Design a system where a daily report can be automatically sent to the owner's 
  WhatsApp number (+923452902229) every night
- Initially implement as a manual "Send Daily Report" button
- Make it extensible so automation (via Python script or cron job) can trigger it later

═══════════════════════════════════════════════════════════════
PART 6 — CUSTOM FEATURES (NOT IN DIGIKAHTA — ADD THESE)
═══════════════════════════════════════════════════════════════

--- 6A. PRODUCT SIZE VARIANTS ---
Each product can have MULTIPLE size variants. Example:
- "Confidor Insecticide" 
  → Variant 1: 100ml bottle — Purchase: Rs.850, Sale: Rs.950, Stock: 45
  → Variant 2: 250ml bottle — Purchase: Rs.1800, Sale: Rs.2100, Stock: 28  
  → Variant 3: 1 Liter can — Purchase: Rs.5500, Sale: Rs.6200, Stock: 12

On bill creation: User picks the PRODUCT first, then selects the SIZE VARIANT.
Each variant has its own stock count, purchase price, sale price.
Stock deduction happens at variant level, not product level.

Database design:
- products table: id, name, category, is_deleted
- product_variants table: id, product_id, size_label, unit, purchase_price, 
  sale_price, stock_quantity, low_stock_threshold

--- 6B. EXPIRY DATE BATCH TRACKING ---
Problem: Same product arrives in different batches with different expiry dates.
Solution — FIFO (First In, First Out) batch system:

When receiving stock (Stock In):
- User enters expiry date for this batch (optional)
- System creates a "batch" record: product_variant_id, quantity, expiry_date, received_date

When selling (Bill or Stock Out):
- System automatically deducts from the OLDEST BATCH first (FIFO)
- If oldest batch has less qty than needed, takes remainder from next batch

Expiry alerts:
- Products expiring within 30 days → YELLOW warning badge
- Products expiring within 7 days → RED urgent badge  
- Products already expired → shown in separate "Expired" section

Batch inventory screen per product:
- Shows all active batches with quantities and expiry dates
- Color coded by expiry status

--- 6C. AI NOTEBOOK SCANNER (GEMINI-POWERED) ---
This feature digitizes old handwritten Urdu/Punjabi notebook ledgers.

HOW THE NOTEBOOKS ARE WRITTEN (critical for AI to understand):
The shop's handwritten notebooks have this exact format:

PHYSICAL STRUCTURE:
- Standard ruled register with RED vertical lines creating columns
- LEFT column (ادھار): credit amounts given in Rs.
- MIDDLE: numbered entries with product and customer info in Urdu
- RIGHT column: payment/return amounts  
- CHECKMARK column: ✓ when entry is verified/closed

EACH PAGE IS ORGANIZED BY DATE:
[Date in RED ink: DD-MM-YY]  [Day name in Urdu: پیر/منگل/بدھ/جمعرات/جمعہ/ہفتہ/اتوار]
① [product info] [customer name/identifier]    Rs.[amount] in left column
② [next entry...]
③ [next entry...]

ENTRY FORMAT DETAILS:
- Circled numbers ①②③ = quantity of that product
- "بنام" (bi-naam) = "in the name of / credited to" → this is the customer name
- Product names are written in abbreviated local Urdu names
- Customer names often include village name or area
- "واپس" (wapis) = return — product was returned, reverse the amount
- Two amounts on same line = partial credit + partial payment on same day
- Checkmark ✓ at end of entry = verified/confirmed
- Some entries span multiple lines if many products for one customer

REAL EXAMPLES FROM THE NOTEBOOK:
- "① ودلمر ① البشا بنام نواز مدرسی — 1700"
  Meaning: 1 Volmer (pesticide) + 1 AlBasha (pesticide brand) credited to Nawaz Madrasi
- "② SOP 25 کلو بنام شریف — 19000"  
  Meaning: 2×25kg SOP (Sulfate of Potash) given to Sharif = Rs.19,000
- "① 10 کلو SOP فسی — 3000 | 1000"
  Meaning: 10kg SOP to Fasi = Rs.3000 credit, Rs.1000 payment received same day
- "① ٹرائی کاڈی ① لٹش ① سانجر بنام طفزا تیلی — 2800"
  Meaning: 1 Tri-Kodi + 1 Litsh + 1 Sanjur pesticides to Tafza Taili = Rs.2800

SCANNER WORKFLOW:
1. User opens Scanner tab
2. Step card 1: "Capture" — tap "Open Camera", take photo of notebook page
3. Step card 2: "AI Processing" — loading animation while Gemini processes
4. Gemini 1.5 Flash API is called with:
   - The image (base64 encoded)
   - This system prompt:
     "You are reading a Pakistani agricultural shop's handwritten Urdu ledger. 
      Each page has entries organized by date. Each entry has: a circled number 
      (quantity), product name in Urdu/local language, customer name (often after 
      'بنام'), and an amount in the left column. 
      Extract ALL entries and return as JSON array:
      [{date, customer_name, product_description, amount, type, notes}]
      type is 'credit' if amount is in left/ادھار column, 'payment' if in right column.
      For returned items (واپس), type is 'return'.
      If unsure, default to 'credit'.
      Return ONLY valid JSON, nothing else."
5. Step card 3: "Review & Confirm" — navigate to scan-review screen

SCAN REVIEW SCREEN:
- Shows list of all AI-extracted entries
- For each entry:
  * Checkbox (checked by default)
  * CUSTOMER FIELD: shows AI-extracted name + fuzzy-matched existing customer 
    (if match found with >70% similarity, auto-select, else show "New Customer")
  * Amount field (editable)
  * Type selector: Credit / Payment / Return
  * Date field
  * Description field (product info from AI)
- Bulk actions: Select All / Deselect All
- "Import [X] Entries" button
- On import: saves as transactions, creates new customers if no match found

FUZZY MATCHING ALGORITHM for customer names:
- Normalize: remove extra spaces, lowercase
- Check if extracted name IS a substring of any existing customer name
- Check if any existing customer name IS a substring of extracted name
- Check Levenshtein distance < 3 characters
- If match found with confidence > 70%: auto-link, show "Matched: [Customer Name]"
- If confidence 40-70%: show as suggestion, user confirms
- If < 40%: show as "New Customer" — will be created

--- 6D. WHATSAPP PAYMENT REMINDER ---
In customer detail screen, a "Send Reminder" button:
- Opens WhatsApp with pre-filled message:
  ```
  السلام علیکم [Customer Name] بھائی/صاحب،
  
  Mahar Zarai Markaz کی طرف سے یاد دہانی:
  آپ کا باقی: Rs.[balance]
  
  جلد ادائیگی فرمائیں۔ شکریہ 🌿
  📞 +923452902229
  ```
- Automatic reminder setting (optional toggle in settings):
  * If enabled: app shows a reminder badge on customers unpaid for 30+ days
  * Daily summary includes "X customers unpaid for 30+ days"

--- 6E. RECYCLE BIN ---
For deleted customers and products:
- Soft delete — never permanently removed immediately
- Recycle Bin screen accessible from More tab
- Shows all deleted customers with deletion date
- "Restore" button — restores with all transaction history intact
- "Permanently Delete" button — with strong confirmation (Admin only)

--- 6F. MORE SCREEN ---
Profile card at top:
- Shop name: Mahar Zarai Markaz
- Location: Sargodha, Punjab
- Phone: +923452902229
- Role badge: ADMIN (with shield icon) or VIEWER (with eye icon)

Quick actions:
- Manual Backup trigger
- Export data
- Share app

Reports section (links to all 6 reports)

Settings section:
- OTP Login Management (change phone number)
- Backup & Restore settings
- WhatsApp Reminder toggle (on/off + set days threshold)
- Currency Display: always "Rs." before numbers
- Language toggle: English / اردو
- About App (version, developer info)
- Recycle Bin

Logout button (with confirmation)

═══════════════════════════════════════════════════════════════
PART 7 — DATABASE SCHEMA (COMPLETE)
═══════════════════════════════════════════════════════════════

Build these exact tables:

settings (key TEXT PRIMARY KEY, value TEXT)

users (id, phone, role, name, created_at)

customers (
  id, name, phone, type [customer/supplier], 
  opening_balance, current_balance, city, cnic, notes,
  is_deleted, deleted_at, created_at, updated_at
)

products (
  id, name, category [Fertilizer/Pesticide/Seed], 
  is_deleted, deleted_at, created_at, updated_at
)

product_variants (
  id, product_id, size_label, unit, purchase_price, sale_price,
  stock_quantity, low_stock_threshold, is_deleted
)

product_batches (
  id, variant_id, quantity_remaining, purchase_price,
  expiry_date, received_date, supplier_name, is_exhausted
)

transactions (
  id, customer_id, type [credit/payment/return],
  amount, description, date, bill_id, image_url,
  is_deleted, deleted_at, created_at
)

stock_entries (
  id, variant_id, type [in/out], quantity, rate, amount,
  supplier_name, reason, notes, expiry_date, batch_id, date
)

bills (
  id, bill_number, customer_id, subtotal, total_amount,
  paid_amount, status [unpaid/partial/paid], date, notes, is_deleted
)

bill_items (
  id, bill_id, variant_id, product_name, size_label, unit,
  quantity, price, total
)

bill_payments (
  id, bill_id, amount, date, notes
)

INDEXES: Create indexes on all foreign keys and date/status columns for performance.

═══════════════════════════════════════════════════════════════
PART 8 — NAVIGATION STRUCTURE (ALL SCREENS)
═══════════════════════════════════════════════════════════════

5 BOTTOM TABS:
1. Home (Dashboard)
2. Khata (Customer Ledger)  
3. Stock (Inventory)
4. Bills
5. More

STACK SCREENS (navigate to from tabs):
- /login — OTP login screen
- /otp-verify — OTP verification screen
- /customer/[id] — Customer detail
- /add-customer — Add/Edit customer form
- /add-transaction — Add credit or payment
- /customer/[id]/statement — Customer statement report
- /product/[id] — Product detail with variants and batches
- /add-product — Add/Edit product form
- /add-variant — Add/Edit product variant
- /stock-in — Stock received form
- /stock-out — Stock dispatch form
- /bill/[id] — Bill detail
- /create-bill — Bill creation (multi-step)
- /scanner — AI notebook scanner
- /scan-review — Review AI scan results
- /reports/daily — Daily summary report
- /reports/outstanding — Outstanding balances report
- /reports/stock — Stock value report
- /reports/monthly — Monthly sales report
- /reports/profit — Profit & loss report
- /reports/customer-ledger — Per-customer ledger report
- /recycle-bin — Deleted items restore
- /settings — App settings
- /settings/otp — Change login phone
- /settings/reminder — WhatsApp reminder settings

═══════════════════════════════════════════════════════════════
PART 9 — UI/UX DESIGN REQUIREMENTS
═══════════════════════════════════════════════════════════════

DESIGN PHILOSOPHY:
- Most PREMIUM, eye-catching, beautiful agricultural app ever built for Pakistan
- Think: combination of Khatabook + a premium banking app + green agriculture feel
- Every screen must look polished, professional, and trustworthy
- Designed for NON-TECHNICAL users — farmers, small business owners
- Must be immediately understandable without any training

COLOR SCHEME (choose based on color psychology for agriculture):
- Primary: Deep Green (#1B5E20 or similar) — growth, nature, trust, agriculture
- Accent: Warm Gold/Yellow (#F9A825 or similar) — harvest, prosperity, Pakistani aesthetic
- Success: Bright Green (#4CAF50) — positive balances, paid bills
- Danger: Red (#E53935) — negative balances, unpaid, out of stock
- Warning: Amber (#FF8F00) — low stock, reminders
- Background: Very light (#F8FAF8) — near white with green tint
- Text: Deep dark (#1A1A1A) for readability
- Surfaces: Pure white (#FFFFFF) cards

NOTE: If green + gold does not look premium enough after testing, try:
- Option B: Deep Navy (#0D47A1) + Gold (#F9A825)
- Option C: Dark Teal (#00695C) + Orange (#FF6D00)
Choose whichever looks most premium and appropriate for agricultural Pakistan.

TYPOGRAPHY:
- Font: Inter (Google Font) — 4 weights: 400/500/600/700
- Language support: Both English and Urdu (system Urdu font for Urdu text)
- Numbers: Always large and bold — financial data must be prominent
- Currency: Always "Rs." before numbers (Rs. 15,000 not 15000 or PKR 15000)

SPACING & LAYOUT:
- Consistent padding: 16px standard, 24px for screens
- Card radius: 12-16px
- Premium shadows (colored shadows matching card content where appropriate)
- Sufficient white space — do not cram too much on one screen

GRADIENT USAGE:
- Screen headers: LinearGradient (primary color variations)
- FAB buttons: LinearGradient
- Summary stat cards: LinearGradient
- CTA buttons: LinearGradient
- Never use flat single-color for important UI elements

MICRO-INTERACTIONS:
- Haptic feedback on button presses (expo-haptics)
- Loading skeletons (not spinners) while data loads
- Smooth transitions between screens
- Pull-to-refresh with custom animation
- Success animations (checkmark) after saving data

RESPONSIVE DESIGN:
- Must work on: 5.5" to 6.8" Android screens
- Infinix and Tecno phones (720p and 1080p)
- Portrait AND Landscape both supported and look good
- FlatList contentContainerStyle paddingBottom: 140 (for tab bar clearance)

═══════════════════════════════════════════════════════════════
PART 10 — SEED DATA TO INCLUDE
═══════════════════════════════════════════════════════════════

The real customer and product data will be provided separately as a JSON file. 
DO NOT hardcode placeholder names. Instead:

1. Create a data/customers.ts file with this structure:
   export const SEED_CUSTOMERS = [] // will be filled with real data later

2. Create a data/products.ts file with this structure:
   export const SEED_PRODUCTS = [] // will be filled with real data later

3. The seeding system should:
   - Check if already seeded on first launch
   - Only seed if the arrays have data
   - Never re-seed if already seeded

The actual data (~119 customers, ~170+ products) will be provided as a separate 
file by the user after the app is built.

═══════════════════════════════════════════════════════════════
PART 11 — SECURITY & DATA INTEGRITY
═══════════════════════════════════════════════════════════════

- SQLite WAL (Write-Ahead Logging) mode for better performance
- SQLite foreign keys enabled
- All deletes are SOFT DELETES (is_deleted flag + deleted_at timestamp)
- Transactions that affect balances must update balance atomically (same DB call)
- When a transaction is deleted: reverse its balance impact automatically
- When a bill is created: stock deduction + customer balance update in single operation
- No data is ever truly deleted without going through Recycle Bin first
- Role check before EVERY add/edit/delete operation in the UI
- Viewer role: all mutation buttons hidden or show "Contact admin" toast

═══════════════════════════════════════════════════════════════
PART 12 — ERROR HANDLING
═══════════════════════════════════════════════════════════════

- ErrorBoundary component wrapping entire app
- Every database operation wrapped in try/catch
- User-friendly error messages in both Urdu and English
- Never show raw error codes to user
- If database fails to load: show friendly screen with retry button
- If OTP fails to send: show retry option + fallback instructions
- Loading states on all async operations
- Empty states with helpful messages on all list screens

═══════════════════════════════════════════════════════════════
PART 13 — TESTING REQUIREMENTS
═══════════════════════════════════════════════════════════════

After building, test EVERY screen and EVERY flow:

1. OTP login flow end-to-end
2. Add customer and verify it appears in list
3. Add credit transaction and verify balance updates
4. Add payment and verify balance decreases
5. Add product with variant
6. Stock In and verify quantity increases
7. Create bill — verify stock deducts AND customer balance increases
8. Record partial payment on bill — verify status changes to "Partial"
9. Record full payment — verify status changes to "Paid"
10. Soft delete customer — verify in Recycle Bin — verify restore works
11. AI Scanner UI flow (camera to review to confirm)
12. WhatsApp sharing on bill
13. All 6 report screens load correctly
14. Viewer role — verify all edit buttons are hidden
15. Biometric login (if available)
16. Responsive layout on different screen sizes

═══════════════════════════════════════════════════════════════
PART 14 — IMPLEMENTATION ORDER (PHASE BY PHASE)
═══════════════════════════════════════════════════════════════

Build in this exact order, fully test each phase before moving to next:

PHASE 1: Foundation
- Project setup, database schema, all tables
- OTP auth system (with mock OTP for development)
- Basic navigation (all 5 tabs + all stack screens registered)
- Design system (colors, fonts, theme)

PHASE 2: Khata Book (Customer Ledger)  
- Customer list with search and filter
- Add/edit customer forms
- Customer detail with transaction history
- Add credit and payment flows
- Dashboard with totals
- Soft delete + Recycle Bin

PHASE 3: Stock Book (Inventory)
- Product list with variants
- Add product + add variant flows
- Stock In / Stock Out forms
- Expiry batch tracking
- Low stock alerts and badges

PHASE 4: Bills System
- Bill creation (multi-step with product variant picker)
- Bill list with filters
- Bill detail with items table
- Multiple payments per bill
- WhatsApp bill sharing
- Auto stock deduction + auto customer ledger entry

PHASE 5: Reports
- All 6 report screens
- Daily summary notification on app open
- Share to WhatsApp for each report
- Profit calculation

PHASE 6: AI Scanner
- Camera integration (conditional for web)
- Gemini 1.5 Flash API integration
- Scan review with fuzzy customer matching
- Import confirmed entries

PHASE 7: More Screen + Settings
- Profile card
- WhatsApp reminder feature
- Settings screens
- Backup system design (modular for future cloud integration)

PHASE 8: Polish & Testing
- Full e2e testing of all flows
- Performance optimization
- Fix any UI inconsistencies
- Ensure all cross-platform compatibility

═══════════════════════════════════════════════════════════════
PART 15 — WHAT TO DELIVER
═══════════════════════════════════════════════════════════════

Deliver a complete, working Expo React Native application that:
✅ Runs on Android without errors
✅ Runs on Web browser (with web fallbacks for native features)
✅ Has all screens fully implemented and navigable
✅ Has complete working database with all CRUD operations
✅ Has premium UI that looks as good as top fintech apps
✅ Has bilingual support (English + Urdu)
✅ Has complete DigiKhata feature clone
✅ Has all 6 custom features (variants, batches, AI scanner, reminders, recycle bin, reports)
✅ Has full test coverage confirming everything works
✅ Has clean, well-commented code organized in a maintainable structure
✅ Has a replit.md or README with full documentation of architecture

After each phase, summarize what was built and ask for confirmation before proceeding 
to the next phase.

DO NOT RUSH. DO NOT SKIP PHASES. BUILD IT PERFECTLY.
```

---

## WHICH AI TO USE

| AI | Best For | How to Use |
|----|---------|-----------|
| **Perplexity AI** (perplexity.ai) | Step 1 Research — finds every DigiKhata feature | Paste the STEP 1 prompt there |
| **Claude (claude.ai)** | Step 2 Building — best at long complex coding tasks | Paste the STEP 2 prompt |
| **ChatGPT-4o** | Alternate builder if Claude is not available | Paste the STEP 2 prompt |

**Recommended workflow:**
1. Go to perplexity.ai → Paste STEP 1 → Copy the detailed DigiKhata research
2. Go to claude.ai → Paste STEP 2 + add the DigiKhata research at the top
3. Tell Claude: "Here is research on DigiKhata: [paste research]. Now build the app using the prompt below."

---

*Created: March 2026 | For: Mahar Zarai Markaz, Sargodha*
