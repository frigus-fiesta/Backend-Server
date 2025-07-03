// import { Hono } from 'hono'
// import { drizzle } from 'drizzle-orm/d1'
// import { events } from '../db/schema'
// import { desc } from "drizzle-orm";
// import { eq } from 'drizzle-orm'

// const app = new Hono<{ Bindings: { DB: D1Database } }>()

// // Get event by slug
// app.get('/events/:slug', async (c) => {
//   const db = drizzle(c.env.DB)
//   const slug = c.req.param('slug')
//   const ev = await db.select().from(events).where(eq(events.slug, slug)).get()
//   return c.json(ev)
// })

// // List upcoming events
// app.get('/events/upcoming', async (c) => {
//   const db = drizzle(c.env.DB)
//   const upcoming = await db
//   .select()
//   .from(events)
//   .where(eq(events.eventStatus, 'upcoming'))
//   .orderBy(desc(events.eventDate)) // ✅ this is valid
//   .limit(10)
//   .all();

//   return c.json(upcoming)
// })

// export default app
