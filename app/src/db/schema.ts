import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============ ENUMS ============
export const orderStatusEnum = pgEnum("order_status", [
  "draft",
  "pending",
  "confirmed",
  "in_progress",
  "ready",
  "completed",
  "cancelled",
]);

export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];

export const notificationStatusEnum = pgEnum("notification_status", [
  "queued",
  "sent",
  "failed",
]);

export const userRoleEnum = pgEnum("user_role", ["admin", "super_admin"]);

// ============ USERS (ADMIN) ============
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 180 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("admin"),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailUnique: uniqueIndex("users_email_unique").on(t.email),
  })
);

// ============ CATEGORIES ============
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    kind: varchar("kind", { length: 20 }).notNull(), // "service" | "product"
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugUnique: uniqueIndex("categories_slug_unique").on(t.slug),
  })
);

// ============ SERVICES ============
export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    shortDescription: text("short_description").notNull(),
    description: text("description").notNull(),
    unit: varchar("unit", { length: 40 }).notNull().default("lembar"), // lembar, buku, m2, dll
    basePrice: integer("base_price").notNull(), // Rupiah, integer
    imageUrl: text("image_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugUnique: uniqueIndex("services_slug_unique").on(t.slug),
    activeIdx: index("services_active_idx").on(t.isActive, t.sortOrder),
  })
);

// ============ SERVICE VARIANTS ============
export const serviceVariants = pgTable(
  "service_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 160 }).notNull(), // contoh: "A4 - Warna - Bolak Balik"
    price: integer("price").notNull(),
    attributes: jsonb("attributes").$type<Record<string, string>>().default({}), // { ukuran: "A4", warna: "warna" }
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    serviceIdx: index("service_variants_service_idx").on(t.serviceId),
  })
);

// ============ PRODUCTS (ATK) ============
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    description: text("description").notNull(),
    price: integer("price").notNull(),
    costPrice: integer("cost_price").notNull().default(0),
    stock: integer("stock").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugUnique: uniqueIndex("products_slug_unique").on(t.slug),
  })
);

// ============ ORDERS ============
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 24 }).notNull(), // DF-YYMMDD-XXXX
    customerName: varchar("customer_name", { length: 120 }).notNull(),
    customerWhatsapp: varchar("customer_whatsapp", { length: 20 }).notNull(),
    customerNote: text("customer_note"),
    totalEstimate: integer("total_estimate").notNull().default(0),
    finalTotal: integer("final_total"),
    status: orderStatusEnum("status").notNull().default("pending"),
    adminNote: text("admin_note"),
    pickupMethod: varchar("pickup_method", { length: 20 }).notNull().default("pickup"), // pickup | delivery
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    codeUnique: uniqueIndex("orders_code_unique").on(t.code),
    statusIdx: index("orders_status_created_idx").on(t.status, t.createdAt),
  })
);

// ============ ORDER ITEMS ============
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    itemType: varchar("item_type", { length: 10 }).notNull(), // "service" | "product"
    serviceId: uuid("service_id").references(() => services.id, { onDelete: "set null" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    variantLabel: varchar("variant_label", { length: 160 }),
    itemName: varchar("item_name", { length: 180 }).notNull(),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull().default(1),
    subtotal: integer("subtotal").notNull(),
    discountPercent: integer("discount_percent").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orderIdx: index("order_items_order_idx").on(t.orderId),
  })
);

// ============ ORDER STATUS LOGS ============
export const orderStatusLogs = pgTable("order_status_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  fromStatus: orderStatusEnum("from_status"),
  toStatus: orderStatusEnum("to_status").notNull(),
  changedByUserId: uuid("changed_by_user_id").references(() => users.id),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============ NOTIFICATIONS ============
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    channel: varchar("channel", { length: 20 }).notNull().default("whatsapp"),
    provider: varchar("provider", { length: 30 }).notNull().default("fonnte"),
    targetNumber: varchar("target_number", { length: 20 }).notNull(),
    templateKey: varchar("template_key", { length: 60 }).notNull(),
    messageBody: text("message_body").notNull(),
    status: notificationStatusEnum("status").notNull().default("queued"),
    providerMessageId: varchar("provider_message_id", { length: 120 }),
    responsePayload: jsonb("response_payload").$type<Record<string, unknown>>(),
    retryCount: integer("retry_count").notNull().default(0),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orderIdx: index("notifications_order_idx").on(t.orderId),
    statusIdx: index("notifications_status_idx").on(t.status, t.createdAt),
  })
);

// ============ MESSAGE TEMPLATES ============
export const messageTemplates = pgTable(
  "message_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 60 }).notNull(), // "order_created_admin", "status_in_progress_customer", dst
    title: varchar("title", { length: 120 }).notNull(),
    body: text("body").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    keyUnique: uniqueIndex("message_templates_key_unique").on(t.key),
  })
);

// ============ SETTINGS (SINGLETON per key) ============
export const settings = pgTable(
  "settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 80 }).notNull(),
    value: jsonb("value").$type<unknown>().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    keyUnique: uniqueIndex("settings_key_unique").on(t.key),
  })
);

// ============ ACTIVITY LOGS ============
export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 80 }).notNull(),
  entity: varchar("entity", { length: 60 }).notNull(),
  entityId: varchar("entity_id", { length: 80 }),
  payload: jsonb("payload").$type<Record<string, unknown>>(),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============ RELATIONS ============
export const categoriesRelations = relations(categories, ({ many }) => ({
  services: many(services),
  products: many(products),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  category: one(categories, { fields: [services.categoryId], references: [categories.id] }),
  variants: many(serviceVariants),
}));

export const serviceVariantsRelations = relations(serviceVariants, ({ one }) => ({
  service: one(services, { fields: [serviceVariants.serviceId], references: [services.id] }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
  statusLogs: many(orderStatusLogs),
  notifications: many(notifications),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  service: one(services, { fields: [orderItems.serviceId], references: [services.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const orderStatusLogsRelations = relations(orderStatusLogs, ({ one }) => ({
  order: one(orders, { fields: [orderStatusLogs.orderId], references: [orders.id] }),
  changedBy: one(users, { fields: [orderStatusLogs.changedByUserId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  order: one(orders, { fields: [notifications.orderId], references: [orders.id] }),
}));
