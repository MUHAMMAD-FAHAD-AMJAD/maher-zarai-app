# Maher Zarai Markaz — Complete Q&A Record
## Every Question Asked Across All Sessions
## Total: 120 Questions | Owner: Muhammad Mahad Amjad | Shop: Sargodha, Pakistan

---

# SESSION 1 — V1 APP BUILD (Original Questions)

---

**Q1: What app do you want to build?**
> A: A premium Android app for "Maher Zarai Markaz" — an agricultural and pesticide shop in Pakistan. It should completely replace DigiKhata with our own custom solution. Zero monthly cost, offline-first, and fully owned by us.

---

**Q2: What features do you need in the app?**
> A: Five main features:
> 1. Customer Khata/Ledger (udhar tracking)
> 2. Full Inventory/Stock Management
> 3. Bill Creation with WhatsApp Sharing
> 4. AI Notebook Scanner (for scanning handwritten Urdu notebooks using Gemini)
> 5. OTP-based Data Recovery + Google Drive automatic backup

---

**Q3: What kind of customers does the shop have?**
> A: Both customers (who owe money — udhar) and suppliers (who we owe money to). The app needs to handle both types. Pakistani agriculture business context — Urdu names, local business style.

---

**Q4: What should the color scheme and branding look like?**
> A: Premium and professional. The colors were later changed to Deep Green (#1B5E20) and Warm Gold (#F9A825) for agricultural psychology. Use gradients, glass effects, modern UI throughout.

---

**Q5: What authentication system do you want?**
> A: OTP-based login — enter phone number → OTP comes via WhatsApp or SMS → enter OTP → logged in. This is ALSO the data recovery/backup restore system. No PIN system.

---

**Q6: Should the app work offline?**
> A: Yes, 100% offline-first. SQLite database stored on the device. No internet required for daily operations. Only internet needed for backup/restore.

---

**Q7: What navigation structure do you want?**
> A: Five bottom tabs:
> 1. Home (Dashboard)
> 2. Khata (Customer Ledger)
> 3. Stock (Inventory)
> 4. Bills
> 5. More (Settings, Reports, Scanner)

---

**Q8: Do you have existing customer and product data?**
> A: Yes — 119 real customers and 170+ real products (fertilizers, pesticides, seeds). Data will be provided separately when the new app is being built. Keep seed arrays empty for now.

---

**Q9: What fonts should be used?**
> A: Inter font family — Regular (400), Medium (500), SemiBold (600), Bold (700). Modern and clean, works well for both English and numbers. Urdu text handled by system fonts.

---

**Q10: What kind of UI components do you want?**
> A: Premium cards with gradient headers and buttons, colored shadows, smooth rounded corners (12-16px), micro-animations, haptic feedback. Full reusable component library.

---

**Q11: Should components be reusable across all screens?**
> A: Yes — create a full design system so every screen looks consistent. Buttons, inputs, cards, badges, modals, bottom sheets, avatars, empty states, list items — all standardized.

---

**Q12: What should the Khata dashboard show?**
> A: Summary cards at top:
> - "لینے ہیں" (To Receive) — total outstanding from customers
> - "دینے ہیں" (To Give) — total owed to suppliers
> Then the customer list below with search and filters.

---

**Q13: How should customers be displayed in the list?**
> A: Each customer card shows: Avatar (colored circle with initials), Customer name, Phone number, Outstanding balance (red if they owe us, green if we owe them), Type badge (Customer/Supplier).

---

**Q14: How does customer search work?**
> A: Real-time search by name OR phone number as you type. Filter tabs: All / Customers / Suppliers. Instant results without pressing any button.

---

**Q15: What happens when you tap on a customer?**
> A: Opens Customer Detail screen with gradient header showing name, phone, balance. Full transaction history (credit/payment list) below. Buttons: Add Credit (Udhar), Record Payment.

---

**Q16: How does adding a transaction work?**
> A: Two types:
> - Credit (Udhar): Enter amount + optional note → customer balance INCREASES (they owe us more)
> - Payment: Enter amount + optional note → customer balance DECREASES
> Both instantly update the balance.

---

**Q17: Can customers be deleted?**
> A: Soft delete only — they go to Recycle Bin. Can be restored from there with all transaction history intact. Never permanently deleted unless explicitly done from Recycle Bin. Admin-only.

---

**Q18: What should the Stock dashboard show?**
> A: Four stat cards: Total Products, In Stock, Low Stock (below threshold), Out of Stock (zero quantity).

---

**Q19: What product categories are there?**
> A: Three categories ONLY (no Equipment):
> - Fertilizer (کھاد)
> - Pesticide (کیڑے مار دوا) — includes nutrients like zinc, boron, sulfur
> - Seed (بیج)

---

**Q20: What units are supported for products?**
> A: KG, Liter, Bag, Box, Piece, Bundle, Bottle, Can, Packet, Gram, ML.

---

**Q21: What information is stored per product?**
> A: Name, Category, Unit, Opening Stock, Purchase Price (buying), Sale Price (selling), Auto-calculated profit margin %, Current stock level, Supplier name (optional), Low stock threshold.

---

**Q22: How does Stock In/Out work?**
> A: Stock In: Search product + variant, enter quantity received, enter purchase rate, expiry date (optional), date. Creates a batch record.
> Stock Out: Search product + variant, enter quantity, reason. FIFO deduction from oldest batch first.

---

**Q23: What happens when stock is low?**
> A: Low stock badge turns yellow/amber on product card. Dashboard low-stock counter updates. Red badge if expiring within 7 days, yellow if within 30 days.

---

**Q24: How does bill creation work step by step?**
> A: 3-step wizard:
> 1. Select Customer (or Cash Sale)
> 2. Add Products (search, pick variant, set quantity — price auto-fills)
> 3. Review & Confirm (shows totals, payment received, balance due)
> On save: auto-deducts stock + auto-creates credit transaction in customer ledger.

---

**Q25: What does the Bills list screen show?**
> A: Monthly stats at top (total sales, bill count, collected, pending). Filter tabs: All/Unpaid/Partial/Paid. Each bill card: customer name, date, total amount, status badge.

---

**Q26: What does the Bill Detail screen show?**
> A: Bill number, date, customer info, itemized table (Product, Size, Qty, Price, Total), subtotal, grand total, amount paid, balance due, payment history, action buttons.

---

**Q27: How does WhatsApp bill sharing work?**
> A: Tap WhatsApp button → opens WhatsApp with pre-formatted Urdu+English message containing shop name, bill number, all items with prices, total, balance due. On web: copies to clipboard.

---

**Q28: Does a bill support multiple partial payments?**
> A: Yes — one bill can receive multiple payments over time. Each payment recorded separately. Bill status: Unpaid → Partial → Paid automatically based on amounts.

---

**Q29: What AI model is used for the notebook scanner?**
> A: Gemini 1.5 Flash — Google's multimodal AI. Can read handwritten Urdu text from photos. Fast and accurate for Pakistani handwriting. API key stored in environment variable.

---

**Q30: What is the scanner workflow?**
> A: Three steps:
> 1. Capture — Take photo of handwritten notebook page
> 2. AI Processing — Gemini reads Urdu handwriting and extracts entries
> 3. Review & Confirm — Check each extracted entry, edit if needed, then import

---

**Q31: What does the scan review screen show?**
> A: List of AI-extracted entries. Each entry shows: customer name (AI extracted + fuzzy matched to existing customer), amount, type (credit/payment/return), date, description. Checkbox to include/exclude.

---

**Q32: What if the app is opened on web browser?**
> A: Camera only works on Android. On web, the scanner shows a friendly message. All other features (khata, stock, bills, reports) work on web using in-memory data fallback instead of SQLite.

---

**Q33: What does the More screen profile card show?**
> A: Shop name (Mahar Zarai Markaz), Location (Sargodha), Owner name, Phone (+923452902229), Role badge (ADMIN with shield icon or VIEWER with eye icon).

---

**Q34: What reports are available?**
> A: Six reports:
> 1. Daily Summary — today's sales and collections
> 2. Customer Ledger — per-customer full history
> 3. Stock Report — full inventory with values
> 4. Monthly Sales — month-wise sales trends
> 5. Outstanding Balances — all customers with pending amounts
> 6. Profit & Loss — revenue, cost, gross profit

---

**Q35: What settings are available?**
> A: OTP Login Management, Backup & Restore, WhatsApp Reminder toggle (on/off + days threshold), Language toggle (English/Urdu), Recycle Bin, About App, Help.

---

**Q36: How does logout work?**
> A: Tapping logout shows confirmation dialog. On confirm, clears auth state and returns to login screen. No data is lost — data stays on device (and in backup if set up).

---

**Q37: Why was the database crashing on web?**
> A: expo-sqlite uses WebAssembly on web which needs special setup. All database imports made conditional using Platform.OS check. On web, in-memory arrays used instead. App runs on both Android and web.

---

**Q38: Why was Alert.prompt causing issues?**
> A: Alert.prompt() is iOS-only — crashes on Android and web. Replaced with custom cross-platform Modal component with TextInput inside. Works perfectly on all platforms.

---

**Q39: Why was the Share button not working on web?**
> A: Share.share() from React Native is not available on web. Added Platform check: Android/iOS uses native Share sheet; web copies to clipboard with "Copied!" confirmation.

---

**Q40: Why were expo-local-authentication and expo-image-picker crashing on web?**
> A: These native modules don't exist on web. Fixed by using conditional require() inside async functions instead of static import statements at the top of files.

---

**Q41: Was biometric login safe — could someone bypass PIN?**
> A: Fixed — biometric login only works if user previously logged in with OTP (which stores their role). If no role saved, biometric shows error and requires OTP login first.

---

**Q42: Can you push the code to GitHub?**
> A: Yes. Used GitHub Personal Access Token (repo scope) to push all files to https://github.com/MUHAMMAD-FAHAD-AMJAD/maher-zarai-app as the main branch.

---

**Q43: Was everything pushed completely?**
> A: Yes — 302 git objects (5.35 MB) including all screens, database, auth, design system, 119 customers, 170+ products, all documentation files, configs, and assets.

---

**Q44: Can all 9 e2e tests pass?**
> A: Yes — all 9 test steps passed: Login, PIN keypad, Khata Book, Add Customer, Customer Detail, Stock Book, Add Product, Bills screen, Scanner screen, More screen — all PASS.

---

**Q45: What is the final state of V1?**
> A: Fully built and tested with premium UI, all core features working, 119 customers + 170 products pre-loaded, full database CRUD, role-based access, biometric auth, WhatsApp sharing, cross-platform, pushed to GitHub.

---

**Q46: Why Expo React Native instead of native Android?**
> A: Single codebase for Android + web preview, built-in SQLite/camera/biometric APIs, faster development, easy APK build with EAS Build, zero extra monthly cost.

---

**Q47: Why SQLite instead of cloud database?**
> A: Shop wants zero monthly costs and offline operation. SQLite stores everything on device. No internet required for daily work. Backup to Google Drive is optional.

---

**Q48: Why pnpm monorepo structure?**
> A: Replit environment uses pnpm workspaces. Allows the Expo app, API server, and design sandbox to coexist cleanly with shared types.

---

**Q49: What is still pending from V1 for future work?**
> A: Gemini AI actual integration (currently placeholder UI), Google Drive backup, OTP-based data recovery, PDF export, push notifications for low stock/payment reminders.

---

**Q50: What documentation was created?**
> A: Three major documentation files pushed to GitHub:
> 1. PROJECT_DOCUMENTATION.md — phase-by-phase build summary
> 2. COMPLETE_QA_SESSION.md — all 50 Q&A from V1
> 3. MAHAR_ZARAI_MARKAZ_COMPLETE_DOCUMENTATION.md — 2,416-line complete requirements document

---

# SESSION 2 — NEW BUILD REQUIREMENTS (Detailed Questions)

---

**Q51: Where exactly is the shop located?**
> A: Sargodha, Punjab, Pakistan. (Important correction — previously said Rawalpindi which was WRONG. The correct city is Sargodha.)

---

**Q52: What is the owner's full name?**
> A: Muhammad Mahad Amjad (important correction — previously recorded as Muhammad Fahad Amjad which was wrong).

---

**Q53: What is the contact phone number for the shop?**
> A: +923452902229 — this number is used for EVERYTHING: customer calls, WhatsApp messages, AND printed/shared on bills. All-purpose shop number.

---

**Q54: Does the shop have a custom logo?**
> A: No custom logo exists and none is wanted. Do NOT add any logo to the app at all. Use text-based branding only (shop name in stylized text/fonts).

---

**Q55: What type of login/authentication does the shop want?**
> A: OTP-based login ONLY. No PIN system at all. User enters Pakistani phone number → OTP arrives via WhatsApp or SMS → enters 6-digit OTP → logged in. Same process also restores all data if phone is changed.

---

**Q56: Is the login system also the backup/recovery system?**
> A: Yes, exactly. They are ONE combined system. Doing OTP login = data recovery. No separate backup UI needed. Just OTP login from any phone and all data comes back.

---

**Q57: How many user roles are needed?**
> A: Exactly two roles:
> - Admin: full access — can add, edit, delete everything
> - Viewer: can see everything but CANNOT add/edit/delete anything. All action buttons hidden for Viewer.
> No third role needed.

---

**Q58: Is there an auto-lock or passcode screen?**
> A: No. No auto-lock. No session timeout. No passcode screen. Once logged in, the user stays logged in.

---

**Q59: Does the app support both English and Urdu?**
> A: Yes — bilingual throughout. Labels shown in both Urdu and English on the same screen (e.g., "لینے ہیں / To Receive"). Users should understand without knowing either language perfectly.

---

**Q60: Is the word "Udhar" or "Credit" used in the app?**
> A: Both are acceptable. Use "اُدھار / Credit" format — Urdu first, English in smaller text below or beside.

---

**Q61: Is there a credit limit for customers?**
> A: No credit limit. Customers can have any amount of outstanding balance. No restriction or warning on how much credit is given.

---

**Q62: Is there a WhatsApp reminder for unpaid customers?**
> A: Yes — optional toggle feature. If turned ON in settings, the app shows a badge on customers who have been unpaid for more than 30 days. User can manually send WhatsApp reminder from customer detail screen.

---

**Q63: Is the CNIC (National ID) field required for customers?**
> A: Optional — the field exists and can be filled but is NOT compulsory. Customer can be added without CNIC.

---

**Q64: Is the City/Area field required for customers?**
> A: Optional — the field exists and can be filled but is NOT compulsory. Customer can be added without city.

---

**Q65: What product categories does the shop have?**
> A: Exactly three categories — NO Equipment category:
> 1. Fertilizer (کھاد)
> 2. Pesticide (کیڑے مار دوا) — this ALSO includes micronutrients like Zinc, Boron, Sulfur, Potassium, etc.
> 3. Seed (بیج)

---

**Q66: Why do nutrients like Zinc and Boron go under Pesticide?**
> A: In Pakistani agricultural shops, micronutrients are sold in the same section as pesticides and are considered part of the same product category. This is how the shop organizes inventory.

---

**Q67: Do products have multiple sizes?**
> A: Yes — one product can have multiple size variants. Example: "Confidor" pesticide comes in 100ml, 250ml, and 1 Liter sizes. Each size has its own price, purchase cost, and separate stock count.

---

**Q68: When creating a bill, how are product variants selected?**
> A: User first searches and picks the PRODUCT (e.g., "Confidor"). Then a size/variant selector appears (e.g., 100ml, 250ml, 1L) and they pick the size. Each variant has its own price that auto-fills.

---

**Q69: Is there an expiry date tracking system?**
> A: Yes — complex FIFO (First In, First Out) batch system. Each Stock In creates a batch with expiry date and quantity. When goods are sold, the system automatically deducts from the oldest batch first. Products expiring soon show alerts.

---

**Q70: How does the FIFO batch system work in detail?**
> A: When stock arrives → create batch record (quantity, expiry date, purchase price, date received). When selling → look at all batches for that variant ordered by received date (oldest first), deduct from oldest until quantity is fulfilled. If oldest batch runs out, take remainder from next batch.

---

**Q71: What expiry alerts are shown?**
> A: Three levels:
> - FRESH: more than 30 days until expiry (no alert)
> - EXPIRING SOON: within 30 days (yellow warning badge)
> - EXPIRING VERY SOON: within 7 days (red urgent badge)
> - EXPIRED: past expiry date (shown in separate "Expired" section)

---

**Q72: Is there a barcode scanner for products?**
> A: No barcode scanner is needed. Products are searched by name.

---

**Q73: Is supplier tracking compulsory for products?**
> A: No — supplier name is an optional field. Products can be added without linking to any supplier.

---

**Q74: Is there a minimum selling price restriction?**
> A: No minimum price. User can set any sale price, even below purchase price. The app shows profit margin as information but does NOT restrict or warn about below-cost selling.

---

**Q75: Is there a discount field in bills?**
> A: No discount field. Bills are straightforward: items × price = total. No discount on individual items or total.

---

**Q76: Is there a tax or GST field in bills?**
> A: No tax field. Pakistan's small shops typically do not include GST in bills. Amounts shown are simple totals.

---

**Q77: Is bill sharing on WhatsApp compulsory?**
> A: No — completely optional. The bill is saved first. User then has the choice to share it on WhatsApp or not.

---

**Q78: Is there a Terms & Conditions section on bills?**
> A: No terms and conditions. Clean, simple bill format.

---

**Q79: Is thermal printer support needed?**
> A: No thermal printer. Bills are shared digitally via WhatsApp only.

---

**Q80: Is there a customer signature field?**
> A: No signature field needed.

---

**Q81: Can bills have multiple payment records?**
> A: Yes — a single bill can receive multiple partial payments over time. Example: Bill of Rs. 10,000 → customer pays Rs. 3,000 today → pays Rs. 4,000 next week → pays Rs. 3,000 later. Each payment recorded separately. Bill status: Unpaid → Partial → Paid.

---

**Q82: What color scheme should be used?**
> A: Deep Green + Warm Gold (agricultural psychology):
> - Primary: #1B5E20 (Deep Forest Green) — growth, nature, trust, agriculture
> - Accent: #F9A825 (Warm Gold/Harvest Yellow) — harvest, prosperity, Pakistani aesthetic
> If this combination doesn't look premium enough, alternatives: Navy+Gold or Dark Teal+Orange.

---

**Q83: Should the app support dark mode?**
> A: Light mode only initially. Dark mode can be added later if requested.

---

**Q84: How should currency amounts be displayed?**
> A: Always "Rs." BEFORE the number. Never just the number alone. Never "PKR". Example: Rs. 1,234 (with comma separator).

---

**Q85: What date format should be used?**
> A: DD/MM/YY format (Pakistani standard). Example: 28/03/26 for March 28, 2026.

---

**Q86: What Android devices does the app target?**
> A: Infinix and Tecno Android phones — common mid-range Pakistani brands. Screens: 720p to 1080p, sizes 5.5" to 6.8". App must work well on these specific devices.

---

**Q87: Does the app support portrait and landscape orientation?**
> A: Yes — both portrait and landscape must be fully supported and look good. Not just tolerated, actually well-designed for both orientations.

---

**Q88: What is the most important daily report?**
> A: Two most important:
> 1. Daily Sales Summary — how much sold today, how much collected
> 2. Customer Outstanding — who owes how much, sorted by amount

---

**Q89: Is there an automatic daily report notification?**
> A: When app is opened each day, show a summary banner/card: "Today: Rs.[X] sales | Outstanding: Rs.[Y] from [Z] customers". Also, design a "Send Daily Report" button that sends report to owner's WhatsApp (+923452902229) — built initially as manual button but designed to work with Python automation later.

---

**Q90: Is profit tracking required?**
> A: Yes — track profit on every sale. Profit = Sale Price minus Purchase Price, multiplied by quantity. Show total profit for any period in the Profit & Loss report.

---

**Q91: What is the nightly report format?**
> A: One consolidated WhatsApp message sent to owner's number (+923452902229):
> - Today's total sales amount
> - Number of bills created today
> - Amount collected today
> - Outstanding customers count and total amount
> - Which customers had their balance increase today

---

**Q92: Will a Python or other tool be used for automation later?**
> A: Yes — the daily/nightly report system should be designed as a modular function that can be triggered externally (by Python script, cron job, or other tool). Build it as a function, start with manual button.

---

**Q93: Where is data stored — local device or cloud?**
> A: Primary storage is LOCAL SQLite on the device (offline-first, zero cost). Cloud backup is secondary — design as modular so cloud provider (Google Drive or custom server) can be switched later. OTP login = data restore trigger.

---

**Q94: How does data restore work on a new phone?**
> A: User enters phone number on new phone → OTP sent → enters OTP → system fetches and restores all data from backup cloud storage → all previous customers, products, transactions, bills come back.

---

**Q95: What does the handwritten notebook look like?**
> A: Standard ruled register with red vertical dividing lines creating columns:
> - LEFT column (ادھار): credit amounts in PKR
> - MIDDLE: date (in red DD-MM-YY) + Urdu day name + numbered entries with product/customer info
> - RIGHT column: payment/return amounts
> - CHECKMARK (✓): placed when entry is verified/paid

---

**Q96: How is each notebook entry written?**
> A: Format: Circled number (①②③) = quantity + product name in Urdu + customer name (often after "بنام") + amount in ادھار column.
> Example: "① ودلمر ① البشا بنام نواز مدرسی — 1700"
> Meaning: 1 Volmer pesticide + 1 AlBasha pesticide given to Nawaz Madrasi = Rs. 1,700 credit.

---

**Q97: What does "بنام" mean in the notebook?**
> A: "بنام" (bi-naam) means "in the name of" or "credited to". It indicates who received the goods on credit. The customer name always follows بنام.

---

**Q98: What does "واپس" mean in the notebook?**
> A: "واپس" (wapis) means "return". If an entry has واپس, the product was returned and the amount should be reversed (treated as return, not a new credit).

---

**Q99: How does the AI fuzzy matching work for customer names?**
> A: Three confidence levels:
> - >70% match: AUTO-LINK to existing customer (show as "✓ Matched: [Name]")
> - 40-70% match: SUGGEST the match (show as "⚠ Possible: [Name] — Confirm?")
> - <40% match: Treat as NEW CUSTOMER (will be created on import)
> Algorithm: check substring match first, then Levenshtein distance.

---

**Q100: What happens when the AI scanner extracts a new customer name?**
> A: If confidence is <40% (no match found), the entry is marked "New Customer". On confirming import, a new customer record is automatically created with the extracted name. User can also manually tap the customer field to search and link to an existing customer before importing.

---

**Q101: Can the user edit AI-extracted entries before importing?**
> A: Yes — the Scan Review screen shows all entries for editing before saving. User can:
> - Check/uncheck each entry
> - Edit the amount
> - Change the type (credit/payment/return)
> - Change the customer (search existing customers)
> - Edit the description
> - Change the date

---

**Q102: What happens if AI cannot read the handwriting clearly?**
> A: The AI (Gemini 1.5 Flash) returns its best estimate even for unclear text. User reviews the entries on Scan Review screen and can correct anything that was misread before importing. The user is always the final decision-maker.

---

**Q103: Should the WhatsApp reminder be automatic?**
> A: The reminder itself (sending the WhatsApp) is ALWAYS manual — user taps the button. But if the toggle is ON in settings, the app shows a BADGE/INDICATOR on customers who have been unpaid for more than 30 days, reminding the user to send a reminder.

---

**Q104: What is the exact text of the WhatsApp payment reminder?**
> A: 
> "السلام علیکم [Customer Name] بھائی/صاحب،
> 
> ماہر زرعی مرکز کی طرف سے یاد دہانی:
> آپ کا باقی: Rs. [balance]
> آخری تاریخ: [last transaction date]
> 
> جلد ادائیگی فرمائیں۔ شکریہ 🌿
> 📞 +923452902229"

---

**Q105: What is the exact format of the WhatsApp bill?**
> A: 
> "*ماہر زرعی مرکز*
> Mahar Zarai Markaz
> Sargodha, Punjab
> 📞 +923452902229
> 
> بل نمبر / Bill #: MZM-[001]
> تاریخ / Date: [DD/MM/YY]
> گاہک / Customer: [name]
> 
> مصنوعات / Items:
> • [product] [size] × [qty] @ Rs.[price] = Rs.[total]
> 
> کل / Total: Rs.[amount]
> ادا شدہ / Paid: Rs.[paid]
> باقی / Due: Rs.[due]
> 
> جزاک اللہ خیر 🌿"

---

**Q106: What format is the bill number?**
> A: MZM-001, MZM-002, MZM-003 (auto-incrementing). MZM = initials of Mahar Zarai Markaz. Padded to 3 digits with leading zeros.

---

**Q107: Does the app need to show supplier accounts (money we owe to suppliers)?**
> A: Yes — suppliers are tracked the same way as customers but in reverse. When we buy from a supplier on credit, their balance shows what WE OWE THEM. When we pay them, the balance reduces. Suppliers appear in the Khata list with a different badge.

---

**Q108: What is the CashBook feature?**
> A: Separate daily cash register. Tracks all physical cash entering and leaving the shop:
> - Cash In: from sales, other income
> - Cash Out: purchases, expenses, salary, other costs
> Shows opening balance, all entries for the day, closing balance. Helps track physical cash vs credit/book entries.

---

**Q109: Can staff members access the app?**
> A: Via the Viewer role — a staff member can be given access with Viewer login (OTP to their number, assigned Viewer role). They can see all data, help customers look up info, but cannot change anything. No separate staff management module needed.

---

**Q110: Is Google Drive integration needed right now?**
> A: Design the backup system as modular (so any cloud storage can be plugged in), but the actual Google Drive integration can be implemented later. Initial version: backup trigger exists in UI but actual upload is placeholder.

---

**Q111: What should the Recycle Bin show?**
> A: Two tabs: Deleted Customers and Deleted Products. Each deleted item shows: Name, deletion date. Two buttons: Restore (green) and Delete Permanently (red, requires confirmation). Restore brings back the item with ALL its history intact.

---

**Q112: What happens to transactions when a customer is deleted?**
> A: The customer is soft-deleted (is_deleted = 1). All their transactions remain in the database. Their balance remains in the summary (or is excluded — this can be configured). When restored, everything comes back exactly as it was.

---

**Q113: Does the app need multi-language toggle in settings?**
> A: Yes — Language setting lets user toggle between English and Urdu. The app shows bilingual labels by default (both languages), but the toggle can adjust which language is PRIMARY.

---

**Q114: Should the app have an "About" screen?**
> A: Yes — accessible from More → Settings → About App. Shows: App version, Shop name, Owner name, Phone number. Simple info screen.

---

**Q115: How should products be searched when creating a bill?**
> A: Real-time search by product name. Results show: product name + category + available variants (sizes). Tap a product → variant/size selector appears as chips. Select size → price auto-fills. Enter quantity.

---

**Q116: Can price be overridden on individual bill items?**
> A: Yes — the price auto-fills from the variant's sale price but is EDITABLE. User can tap the price and change it for that specific line item on that specific bill.

---

**Q117: What if a bill is created for a walk-in customer (no account)?**
> A: Select "نقد فروخت / Cash Sale" option when creating bill. Bill is created without linking to any customer. No transaction is added to any customer ledger. Stock is still deducted.

---

**Q118: How are avatars generated for customers?**
> A: Auto-generated colored circles with customer initials. Color is determined by hashing the customer's name — so each customer always gets the same color. 8 possible colors: Green, Blue, Orange, Purple, Red, Teal, Brown, Pink.

---

**Q119: Should the home dashboard show low stock alerts?**
> A: Yes — if any products are on low stock, a "کم اسٹاک / Low Stock Alert" horizontal scroll section appears on the home dashboard showing each low-stock product with a red badge. Tap to go directly to that product.

---

**Q120: What is the final goal for this app?**
> A: A production-ready, premium Android app that:
> - Completely replaces DigiKhata for this specific agricultural shop
> - Works 100% offline with zero monthly cost
> - Looks more professional and premium than DigiKhata
> - Handles all real business needs: customer credit, stock management, FIFO expiry, bills, reports
> - Can scan and digitize 10+ years of handwritten notebook records via AI
> - Sends WhatsApp reminders and reports automatically
> - Designed for non-technical users (farmers, shop owner)
> - Ready for 119 real customers and 170+ real products

---

# SUMMARY TABLE — ALL 120 QUESTIONS

| # | Topic | Category |
|---|-------|----------|
| Q1–Q11 | App concept, features, colors, auth, offline, navigation, data | Foundation |
| Q12–Q17 | Khata dashboard, customer list, search, detail, transactions, delete | Khata Book |
| Q18–Q23 | Stock dashboard, categories, units, product info, stock in/out, alerts | Stock Book |
| Q24–Q28 | Bill creation, bill list, bill detail, WhatsApp share, payments | Bills |
| Q29–Q32 | AI model choice, scanner flow, scan review, web fallback | AI Scanner |
| Q33–Q36 | More screen, reports, settings, logout | More Screen |
| Q37–Q41 | Web crashes, Alert.prompt, Share API, native modules, biometric | Tech Fixes |
| Q42–Q50 | GitHub push, e2e testing, final state, tech decisions, documentation | V1 Completion |
| Q51–Q53 | Shop location (Sargodha), owner name correction, phone number | Shop Basics |
| Q54–Q58 | Logo decision, OTP auth, backup=login, two roles, no auto-lock | Authentication |
| Q59–Q64 | Bilingual support, credit/udhar terminology, credit limits, reminders, CNIC, city | Customers |
| Q65–Q74 | Three categories, nutrients under pesticide, size variants, bill variants, FIFO, expiry alerts, no barcode, supplier optional, no minimum price | Products |
| Q75–Q81 | No discount, no tax, WhatsApp optional, no terms, no printer, no signature, multiple payments | Bills Detail |
| Q82–Q87 | Color scheme (deep green+gold), dark mode, Rs. currency, date format, target devices, orientation | Design |
| Q88–Q94 | Daily reports, auto notification, profit tracking, nightly report, Python automation, data storage, new phone restore | Reports & Data |
| Q95–Q104 | Notebook format, entry format, بنام meaning, واپس meaning, fuzzy matching, new customer creation, editing AI entries, unclear handwriting, reminder toggle | AI Scanner |
| Q105–Q120 | WhatsApp formats, bill number format, supplier accounts, cashbook, staff access, Google Drive, recycle bin, deleted customer data, language toggle, about screen, bill search, price override, cash sale, avatars, low stock, final goal | Remaining Features |

---

**Total: 120 Questions**
**V1 Session: Q1–Q50 (50 questions)**
**V2 New Requirements Session: Q51–Q120 (70 questions)**

---

*Document created: March 2026*
*Owner: Muhammad Mahad Amjad*
*Shop: Mahar Zarai Markaz, Sargodha, Punjab, Pakistan*
*Phone: +923452902229*
*GitHub: https://github.com/MUHAMMAD-FAHAD-AMJAD/maher-zarai-app*
