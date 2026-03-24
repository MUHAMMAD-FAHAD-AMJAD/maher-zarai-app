import { Platform } from 'react-native';
import { CREATE_TABLES_SQL, DATABASE_NAME } from './schema';
import { SEED_CUSTOMERS } from '../data/customers';
import { SEED_PRODUCTS } from '../data/products';

const isWeb = Platform.OS === 'web';

let db: any = null;

const webSettings: Record<string, string> = {
  admin_pin: '000000',
  viewer_pin: '111111',
  last_role: 'admin',
};

let webCustomers: Customer[] = SEED_CUSTOMERS.map((c, i) => ({
  id: i + 1,
  name: c.name,
  phone: c.phone || '',
  type: c.type,
  opening_balance: c.balance,
  current_balance: c.balance,
  notes: null,
  is_deleted: 0,
  deleted_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

let webProducts: Product[] = SEED_PRODUCTS.map((p, i) => ({
  id: i + 1,
  name: p.name,
  unit: p.unit,
  stock_quantity: p.stock,
  purchase_price: 0,
  sale_price: 0,
  low_stock_threshold: 5,
  category: p.category || 'General',
  is_deleted: 0,
  deleted_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

let webTransactions: Transaction[] = [];
let webNextTxnId = 1;

export async function getDatabase(): Promise<any> {
  if (isWeb) return null;
  if (db) return db;
  const SQLite = require('expo-sqlite');
  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = ON');
  return db;
}

export async function initializeDatabase(): Promise<void> {
  if (isWeb) return;
  const database = await getDatabase();
  if (!database) return;

  for (const sql of CREATE_TABLES_SQL) {
    await database.execAsync(sql);
  }

  const versionResult = await database.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'db_version'"
  );

  if (!versionResult) {
    await database.runAsync(
      "INSERT INTO settings (key, value) VALUES ('db_version', '1')"
    );
    await database.runAsync(
      "INSERT INTO settings (key, value) VALUES ('is_seeded', '0')"
    );
    await database.runAsync(
      "INSERT INTO settings (key, value) VALUES ('admin_pin', '000000')"
    );
    await database.runAsync(
      "INSERT INTO settings (key, value) VALUES ('viewer_pin', '111111')"
    );
  }
}

export async function seedDataIfNeeded(): Promise<void> {
  if (isWeb) return;
  const database = await getDatabase();
  if (!database) return;
  const seeded = await database.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'is_seeded'"
  );

  if (seeded && seeded.value === '1') return;

  const customerCount = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM customers'
  );

  if (!customerCount || customerCount.count === 0) {
    for (const customer of SEED_CUSTOMERS) {
      await database.runAsync(
        `INSERT INTO customers (name, phone, type, opening_balance, current_balance) VALUES (?, ?, ?, ?, ?)`,
        [customer.name, customer.phone || '', customer.type, customer.balance, customer.balance]
      );
    }
  }

  const productCount = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM products'
  );

  if (!productCount || productCount.count === 0) {
    for (const product of SEED_PRODUCTS) {
      await database.runAsync(
        `INSERT INTO products (name, unit, stock_quantity, category) VALUES (?, ?, ?, ?)`,
        [product.name, product.unit, product.stock, product.category || 'General']
      );
    }
  }

  await database.runAsync(
    "UPDATE settings SET value = '1' WHERE key = 'is_seeded'"
  );
}

export async function getSetting(key: string): Promise<string | null> {
  if (isWeb) return webSettings[key] || null;
  const database = await getDatabase();
  if (!database) return null;
  const result = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    [key]
  );
  return result ? result.value : null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  if (isWeb) {
    webSettings[key] = value;
    return;
  }
  const database = await getDatabase();
  if (!database) return;
  await database.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [key, value]
  );
}

export type Customer = {
  id: number;
  name: string;
  phone: string;
  type: string;
  opening_balance: number;
  current_balance: number;
  notes: string | null;
  is_deleted: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: number;
  name: string;
  unit: string;
  stock_quantity: number;
  purchase_price: number;
  sale_price: number;
  low_stock_threshold: number;
  category: string | null;
  is_deleted: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: number;
  customer_id: number;
  type: string;
  amount: number;
  description: string | null;
  date: string;
  bill_id: number | null;
  is_deleted: number;
  deleted_at: string | null;
  created_at: string;
};

export type StockEntry = {
  id: number;
  product_id: number;
  type: string;
  quantity: number;
  rate: number;
  amount: number;
  supplier_id: number | null;
  customer_id: number | null;
  notes: string | null;
  date: string;
  is_deleted: number;
};

export type Bill = {
  id: number;
  bill_number: number;
  customer_id: number | null;
  total_amount: number;
  paid_amount: number;
  status: string;
  date: string;
  notes: string | null;
  is_deleted: number;
};

export async function getCustomers(type?: string, includeDeleted = false): Promise<Customer[]> {
  if (isWeb) {
    return webCustomers.filter(c => {
      if (!includeDeleted && c.is_deleted) return false;
      if (type === 'customer') return c.type === 'customer';
      if (type === 'supplier') return c.type === 'supplier';
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }
  const database = await getDatabase();
  if (!database) return [];
  let query = 'SELECT * FROM customers WHERE 1=1';
  const params: any[] = [];

  if (!includeDeleted) {
    query += ' AND is_deleted = 0';
  }
  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }
  query += ' ORDER BY name ASC';

  return database.getAllAsync<Customer>(query, params);
}

export async function getCustomer(id: number): Promise<Customer | null> {
  if (isWeb) return webCustomers.find(c => c.id === id) || null;
  const database = await getDatabase();
  if (!database) return null;
  return database.getFirstAsync<Customer>(
    'SELECT * FROM customers WHERE id = ?',
    [id]
  );
}

export async function addCustomer(
  name: string,
  phone: string,
  type: string,
  openingBalance: number = 0
): Promise<number> {
  if (isWeb) {
    const id = webCustomers.length + 1;
    webCustomers.push({
      id, name, phone, type, opening_balance: openingBalance,
      current_balance: openingBalance, notes: null, is_deleted: 0,
      deleted_at: null, created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return id;
  }
  const database = await getDatabase();
  if (!database) return 0;
  const result = await database.runAsync(
    `INSERT INTO customers (name, phone, type, opening_balance, current_balance) VALUES (?, ?, ?, ?, ?)`,
    [name, phone, type, openingBalance, openingBalance]
  );
  return result.lastInsertRowId;
}

export async function updateCustomer(
  id: number,
  name: string,
  phone: string,
  notes: string
): Promise<void> {
  if (isWeb) {
    const c = webCustomers.find(c => c.id === id);
    if (c) { c.name = name; c.phone = phone; c.notes = notes; }
    return;
  }
  const database = await getDatabase();
  if (!database) return;
  await database.runAsync(
    `UPDATE customers SET name = ?, phone = ?, notes = ?, updated_at = datetime('now') WHERE id = ?`,
    [name, phone, notes, id]
  );
}

export async function softDeleteCustomer(id: number): Promise<void> {
  if (isWeb) {
    const c = webCustomers.find(c => c.id === id);
    if (c) { c.is_deleted = 1; }
    return;
  }
  const database = await getDatabase();
  if (!database) return;
  await database.runAsync(
    `UPDATE customers SET is_deleted = 1, deleted_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`,
    [id]
  );
}

export async function restoreCustomer(id: number): Promise<void> {
  if (isWeb) {
    const c = webCustomers.find(c => c.id === id);
    if (c) { c.is_deleted = 0; }
    return;
  }
  const database = await getDatabase();
  if (!database) return;
  await database.runAsync(
    `UPDATE customers SET is_deleted = 0, deleted_at = NULL, updated_at = datetime('now') WHERE id = ?`,
    [id]
  );
}

export async function updateCustomerBalance(id: number, amount: number): Promise<void> {
  if (isWeb) {
    const c = webCustomers.find(c => c.id === id);
    if (c) { c.current_balance += amount; }
    return;
  }
  const database = await getDatabase();
  if (!database) return;
  await database.runAsync(
    `UPDATE customers SET current_balance = current_balance + ?, updated_at = datetime('now') WHERE id = ?`,
    [amount, id]
  );
}

export async function getProducts(includeDeleted = false): Promise<Product[]> {
  if (isWeb) {
    return webProducts.filter(p => includeDeleted || !p.is_deleted)
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  const database = await getDatabase();
  if (!database) return [];
  let query = 'SELECT * FROM products';
  if (!includeDeleted) {
    query += ' WHERE is_deleted = 0';
  }
  query += ' ORDER BY name ASC';
  return database.getAllAsync<Product>(query);
}

export async function getLowStockProducts(): Promise<Product[]> {
  if (isWeb) {
    return webProducts.filter(p => !p.is_deleted && p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0);
  }
  const database = await getDatabase();
  if (!database) return [];
  return database.getAllAsync<Product>(
    'SELECT * FROM products WHERE is_deleted = 0 AND stock_quantity <= low_stock_threshold ORDER BY stock_quantity ASC'
  );
}

export async function addProduct(
  name: string,
  unit: string,
  stockQuantity: number = 0,
  purchasePrice: number = 0,
  salePrice: number = 0,
  category: string = 'General'
): Promise<number> {
  if (isWeb) {
    const id = webProducts.length + 1;
    webProducts.push({
      id, name, unit, stock_quantity: stockQuantity, purchase_price: purchasePrice,
      sale_price: salePrice, low_stock_threshold: 5, category,
      is_deleted: 0, deleted_at: null,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    });
    return id;
  }
  const database = await getDatabase();
  if (!database) return 0;
  const result = await database.runAsync(
    `INSERT INTO products (name, unit, stock_quantity, purchase_price, sale_price, category) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, unit, stockQuantity, purchasePrice, salePrice, category]
  );
  return result.lastInsertRowId;
}

export async function updateProductStock(id: number, quantityChange: number): Promise<void> {
  if (isWeb) {
    const p = webProducts.find(p => p.id === id);
    if (p) { p.stock_quantity += quantityChange; }
    return;
  }
  const database = await getDatabase();
  if (!database) return;
  await database.runAsync(
    `UPDATE products SET stock_quantity = stock_quantity + ?, updated_at = datetime('now') WHERE id = ?`,
    [quantityChange, id]
  );
}

export async function addTransaction(
  customerId: number,
  type: string,
  amount: number,
  description: string,
  date?: string
): Promise<number> {
  if (isWeb) {
    const id = webNextTxnId++;
    webTransactions.push({
      id, customer_id: customerId, type, amount, description,
      date: date || new Date().toISOString(), bill_id: null,
      is_deleted: 0, deleted_at: null, created_at: new Date().toISOString(),
    });
    if (type === 'credit') await updateCustomerBalance(customerId, amount);
    else if (type === 'payment') await updateCustomerBalance(customerId, -amount);
    return id;
  }
  const database = await getDatabase();
  if (!database) return 0;
  const result = await database.runAsync(
    `INSERT INTO transactions (customer_id, type, amount, description, date) VALUES (?, ?, ?, ?, ?)`,
    [customerId, type, amount, description, date || new Date().toISOString()]
  );

  if (type === 'credit') {
    await updateCustomerBalance(customerId, amount);
  } else if (type === 'payment') {
    await updateCustomerBalance(customerId, -amount);
  }

  return result.lastInsertRowId;
}

export async function getTransactions(customerId: number): Promise<Transaction[]> {
  if (isWeb) {
    return webTransactions.filter(t => t.customer_id === customerId && !t.is_deleted)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  const database = await getDatabase();
  if (!database) return [];
  return database.getAllAsync<Transaction>(
    'SELECT * FROM transactions WHERE customer_id = ? AND is_deleted = 0 ORDER BY date DESC',
    [customerId]
  );
}

export async function addStockEntry(
  productId: number,
  type: string,
  quantity: number,
  rate: number,
  supplierId?: number,
  customerId?: number,
  notes?: string
): Promise<number> {
  if (isWeb) {
    if (type === 'in') await updateProductStock(productId, quantity);
    else if (type === 'out') await updateProductStock(productId, -quantity);
    return 1;
  }
  const database = await getDatabase();
  if (!database) return 0;
  const amount = quantity * rate;
  const result = await database.runAsync(
    `INSERT INTO stock_entries (product_id, type, quantity, rate, amount, supplier_id, customer_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [productId, type, quantity, rate, amount, supplierId || null, customerId || null, notes || '']
  );

  if (type === 'in') {
    await updateProductStock(productId, quantity);
  } else if (type === 'out') {
    await updateProductStock(productId, -quantity);
  }

  return result.lastInsertRowId;
}

export async function getStockEntries(productId?: number, type?: string): Promise<StockEntry[]> {
  if (isWeb) return [];
  const database = await getDatabase();
  if (!database) return [];
  let query = 'SELECT * FROM stock_entries WHERE is_deleted = 0';
  const params: any[] = [];

  if (productId) {
    query += ' AND product_id = ?';
    params.push(productId);
  }
  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }
  query += ' ORDER BY date DESC';

  return database.getAllAsync<StockEntry>(query, params);
}

export async function getDashboardStats(): Promise<{
  totalReceivable: number;
  totalPayable: number;
  customerCount: number;
  supplierCount: number;
  totalProducts: number;
  lowStockCount: number;
}> {
  if (isWeb) {
    const customers = webCustomers.filter(c => !c.is_deleted);
    const customerList = customers.filter(c => c.type === 'customer');
    const supplierList = customers.filter(c => c.type === 'supplier');
    return {
      totalReceivable: customerList.reduce((sum, c) => sum + (c.current_balance > 0 ? c.current_balance : 0), 0),
      totalPayable: supplierList.reduce((sum, c) => sum + (c.current_balance < 0 ? Math.abs(c.current_balance) : 0), 0),
      customerCount: customerList.length,
      supplierCount: supplierList.length,
      totalProducts: webProducts.filter(p => !p.is_deleted).length,
      lowStockCount: webProducts.filter(p => !p.is_deleted && p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0).length,
    };
  }
  const database = await getDatabase();
  if (!database) return { totalReceivable: 0, totalPayable: 0, customerCount: 0, supplierCount: 0, totalProducts: 0, lowStockCount: 0 };

  const receivable = await database.getFirstAsync<{ total: number }>(
    "SELECT COALESCE(SUM(current_balance), 0) as total FROM customers WHERE type = 'customer' AND current_balance > 0 AND is_deleted = 0"
  );
  const payable = await database.getFirstAsync<{ total: number }>(
    "SELECT COALESCE(SUM(ABS(current_balance)), 0) as total FROM customers WHERE type = 'supplier' AND current_balance < 0 AND is_deleted = 0"
  );
  const customerCount = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM customers WHERE type = 'customer' AND is_deleted = 0"
  );
  const supplierCount = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM customers WHERE type = 'supplier' AND is_deleted = 0"
  );
  const productCount = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM products WHERE is_deleted = 0'
  );
  const lowStock = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM products WHERE is_deleted = 0 AND stock_quantity <= low_stock_threshold AND stock_quantity > 0'
  );

  return {
    totalReceivable: receivable?.total || 0,
    totalPayable: payable?.total || 0,
    customerCount: customerCount?.count || 0,
    supplierCount: supplierCount?.count || 0,
    totalProducts: productCount?.count || 0,
    lowStockCount: lowStock?.count || 0,
  };
}
