import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { desc, sql } from "drizzle-orm";

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  title: text("title").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  slug: text("slug").notNull().unique(),

  eventStatus: text("eventStatus").notNull(), // 'upcoming' or 'past' — enforce in app logic
  category: text("category").notNull(),

  eventPrice: real("eventPrice").notNull(), // no CHECK here — validate >= 0 in app
  eventDate: text("eventDate").notNull(), // ISO datetime string

  venue: text("venue").notNull(),

  hostedBy: text("hostedBy").notNull(), // store JSON string
  eventTimeline: text("eventTimeline").notNull(),
  imageGallery: text("imageGallery").notNull(),

  aboutTheHost: text("aboutTheHost"), // optional JSON
  eventHighlights: text("eventHighlights").notNull(),
  importantInfo: text("importantInfo").notNull(),
  ticketPricingList: text("ticketPricingList").notNull(),

  createdAt: text("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});


export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  email: text("email").notNull().unique(),

  subscribed: integer("subscribed", { mode: "boolean" })
    .notNull()
    .default(true),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const eventInfo = sqliteTable("eventInfo",{
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull().unique(),
  eventDate: text("eventDate").notNull(), // ISO datetime string
  tagline: text("tagline"),
  eventStatus: text("eventStatus").notNull(), // 'upcoming' or 'past' — enforce in app logic
  category: text("category").notNull(),
  hostedBy: text("hostedBy").notNull(), // store JSON string
  createdAt: text("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)  
})

export const contactUs = sqliteTable("contactus", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull(),

  email: text("email").notNull(),

  subject: text("subject").notNull(), // or remove `.notNull()` if optional

  description: text("description").notNull(),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});