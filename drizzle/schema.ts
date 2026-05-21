import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().default("Adil Mustafa"),
  headline: varchar("headline", { length: 500 }).notNull().default("Full Stack Developer"),
  tagline: text("tagline"),
  bio: text("bio"),
  email: varchar("email", { length: 255 }),
  location: varchar("location", { length: 255 }),
  resumeUrl: text("resume_url"),
  avatarUrl: text("avatar_url"),
  heroImageUrl: text("hero_image_url"),
  roles: text("roles"),
  availabilityLabel: varchar("availability_label", { length: 255 }),
  servicesHeading: varchar("services_heading", { length: 255 }),
  projectsHeading: varchar("projects_heading", { length: 255 }),
  contactHeading: varchar("contact_heading", { length: 255 }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  link: text("link"),
  imageUrl: text("image_url"),
  tags: text("tags"),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  iconUrl: text("icon_url").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
});

export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  url: text("url").notNull(),
  iconUrl: text("icon_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Public portfolio engagement (resume, projects, load more, etc.) */
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventType: varchar("event_type", { length: 64 }).notNull(),
  entityId: integer("entity_id"),
  entityLabel: varchar("entity_label", { length: 255 }),
  path: varchar("path", { length: 512 }),
  meta: text("meta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
