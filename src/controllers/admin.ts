import { Context } from "hono";
import { events } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Zod schema for validation
const eventSchema = z.object({
  title: z.string(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  slug: z.string(),
  eventStatus: z.enum(["upcoming", "past"]),
  category: z.string(),
  eventPrice: z.number().nonnegative(),
  eventDate: z.string(), // ISO date string
  venue: z.string(),

  hostedBy: z.string(), // JSON string
  eventTimeline: z.string(),
  imageGallery: z.string(),

  aboutTheHost: z.string().optional(),
  eventHighlights: z.string(),
  importantInfo: z.string(),
  ticketPricingList: z.string(),
});

export const createEvent = async (c: Context) => {
  const body = await c.req.json();

  const validation = eventSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: "Invalid request body", details: validation.error.format() }, 400);
  }

  const db = c.env.DB; // now a valid Drizzle client

  const cleanedBody = Object.fromEntries(
    Object.entries(validation.data).filter(([_, v]) => v !== undefined)
  );

  try {
    await db.insert(events).values(cleanedBody); // D1 doesn't support `.returning()`
    return c.json({ message: "Event created" }, 201);
  } catch (err: any) {
    console.error("Insert error:", err);
    return c.json({ error: "Failed to create event", details: err.message }, 500);
  }
};

export const updateEventbyId = async (c: Context) => {
  const eventId = Number(c.req.param("eventId"));
  if (isNaN(eventId)) {
    return c.json({ error: "Invalid event ID" }, 400);
  }

  const body = await c.req.json();

  const validation = eventSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: "Invalid request body", details: validation.error.format() }, 400);
  }

  const db = c.env.DB;
  const result = await db
    .update(events)
    .set({ ...body, updated_at: new Date().toISOString() })
    .where(eq(events.id, eventId))
    .returning();

  if (result.length === 0) {
    return c.json({ error: "Event not found" }, 404);
  }

  return c.json({ message: "Event updated", event: result[0] });
};

export const deleteEventbyId = async (c: Context) => {
  const eventId = Number(c.req.param("eventId"));
  if (isNaN(eventId)) {
    return c.json({ error: "Invalid event ID" }, 400);
  }

  const db = c.env.DB;
  const result = await db.delete(events).where(eq(events.id, eventId)).returning();

  if (result.length === 0) {
    return c.json({ error: "Event not found or already deleted" }, 404);
  }

  return c.json({ message: "Event deleted", event: result[0] });
};
