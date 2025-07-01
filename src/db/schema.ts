import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  title: text("title").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  slug: text("slug").notNull().unique(),

  eventStatus: text("event_status").notNull(), // 'upcoming' or 'past' — enforce in app logic
  category: text("category").notNull(),

  eventPrice: real("event_price").notNull(), // no CHECK here — validate >= 0 in app
  eventDate: text("event_date").notNull(), // ISO datetime string

  venue: text("venue").notNull(),

  hostedBy: text("hosted_by").notNull(), // store JSON string
  eventTimeline: text("event_timeline").notNull(),
  imageGallery: text("image_gallery").notNull(),

  aboutTheHost: text("about_the_host"), // optional JSON
  eventHighlights: text("event_highlights").notNull(),
  importantInfo: text("important_info").notNull(),
  ticketPricingList: text("ticket_pricing_list").notNull(),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
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