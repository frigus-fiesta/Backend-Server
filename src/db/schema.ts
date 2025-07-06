import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { desc, sql } from "drizzle-orm";

// export const events = sqliteTable("events", {
//   id: integer("id").primaryKey({ autoIncrement: true }),

//   title: text("title").notNull(),
//   tagline: text("tagline"),
//   description: text("description"),
//   slug: text("slug").notNull().unique(),

//   eventStatus: text("eventStatus").notNull(), // 'upcoming' or 'past' — enforce in app logic
//   category: text("category").notNull(),

//   eventPrice: real("eventPrice").notNull(), // no CHECK here — validate >= 0 in app
//   eventDate: text("eventDate").notNull(), // ISO datetime string

//   venue: text("venue").notNull(),

//   hostedBy: text("hostedBy").notNull(), // store JSON string
//   // eventTimeline: text("eventTimeline").notNull(),
//   imageGallery: text("imageGallery").notNull(),

//   aboutTheHost: text("aboutTheHost"), // optional JSON
//   // eventHighlights: text("eventHighlights").notNull(),
//   importantInfo: text("importantInfo").notNull(),
//   ticketPricingList: text("ticketPricingList").notNull(),

//   createdAt: text("createdAt")
//     .notNull()
//     .default(sql`CURRENT_TIMESTAMP`),
//   updatedAt: text("updatedAt")
//     .notNull()
//     .default(sql`CURRENT_TIMESTAMP`)
// });


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
  tagline: text("tagline").notNull(),
  eventStatus: text("eventStatus").notNull(), // 'upcoming' or 'past' — enforce in app logic
  category: text("category").notNull(),
  hostedBy: text("hostedBy").notNull(), // store JSON string
  venue: text("venue"),
  imageGallery: text("imageGallery"),
  eventPrice: real("eventPrice"), // no CHECK here — validate >= 0 in app
  ticketPricingList: text("ticketPricingList"),
  importantInfo: text("importantInfo").notNull(),
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

export const appoitmentBooking = sqliteTable("appointmentBooking", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull(),

  email: text("email").notNull(),

  phone: text("phone").notNull(),

  services: text("services").notNull(), // store JSON string

  date: text("date").notNull(), // ISO datetime string

  time: text("time").notNull(), // ISO time string

  description: text("description"),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const userProfiles = sqliteTable("userProfiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  uuid: text("uuid").notNull().unique(), // Composite primary key component // comes in 

  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  full_name: text("full_name").notNull(), // comes in
  avatar_url: text("avatar_url"), // comes in
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),

  updated_at: text("updated_at"),

  email_notifications: text("email_notifications"),

  bio: text("bio"),

  user_login_info: text("user_login_info"), // SQLite doesn't support JSON natively, store as TEXT

  email: text("email").notNull(), // comes in

  reviews: text("reviews"), // Store as JSON string
});

// Reviews table for events
export const eventReviews = sqliteTable('eventReviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // The unique slug of the event being reviewed
  review_of: text('review_of').notNull(), // references the event's `slug`

  // The user who made the review
  uuid: text('uuid').notNull(), // uuid of the user

  // Review content
  comment: text('comment').notNull(),

  // Rating (1 to 5)
  rate: integer('rate').notNull(), // Add validation logic in controller

  // Rating (1 to 5)
  like_count: integer('like_count').notNull(), // Add validation logic in controller

  // Timestamp of the comment
  commented_on: text('commented_on')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
