// import { Context } from "hono";
// import { events } from "../db/schema";
// import { drizzle } from "drizzle-orm/d1";
// import { z } from "zod";

// const eventSchema = z.object({
//   title: z.string(),
//   tagline: z.string().optional(),
//   description: z.string().optional(),
//   slug: z.string(),
//   eventStatus: z.enum(["upcoming", "past"]),
//   category: z.string(),
//   eventPrice: z.number().nonnegative(),
//   eventDate: z.string(),
//   venue: z.string(),
//   hostedBy: z.string(),
//   eventTimeline: z.string(),
//   imageGallery: z.string(),
//   aboutTheHost: z.string().optional(),
//   eventHighlights: z.string(),
//   importantInfo: z.string(),
//   ticketPricingList: z.string(),
// });

// export const createEvent = async (c: Context) => {
//   try {
//     const body = await c.req.json();
    
//     const validation = eventSchema.safeParse(body);
//     if (!validation.success) {
//       return c.json({ error: "Invalid data", details: validation.error.format() }, 400);
//     }

//     const db = drizzle(c.env.DB);
    
//     // Only include fields that exist in the schema (exclude id, createdAt, updatedAt)
//     const insertData = {
//       title: validation.data.title,
//       tagline: validation.data.tagline,
//       description: validation.data.description,
//       slug: validation.data.slug,
//       eventStatus: validation.data.eventStatus,
//       category: validation.data.category,
//       eventPrice: validation.data.eventPrice,
//       eventDate: validation.data.eventDate,
//       venue: validation.data.venue,
//       hostedBy: validation.data.hostedBy,
//       eventTimeline: validation.data.eventTimeline,
//       imageGallery: validation.data.imageGallery,
//       aboutTheHost: validation.data.aboutTheHost,
//       eventHighlights: validation.data.eventHighlights,
//       importantInfo: validation.data.importantInfo,
//       ticketPricingList: validation.data.ticketPricingList,
//     };

//     await db.insert(events).values(insertData);
    
//     return c.json({ message: "Event created successfully" }, 201);
    
//   } catch (error: any) {
//     console.error("Create event error:", error);
//     return c.json({ error: "Failed to create event", details: error.message }, 500);
//   }
// };

// export const updateEventbyId = async (c: Context) => {
//   try {
//     const eventId = Number(c.req.param("eventId"));
//     if (isNaN(eventId) || eventId <= 0) {
//       return c.json({ error: "Invalid event ID" }, 400);
//     }

//     const body = await c.req.json();

//     const validation = updateEventSchema.safeParse(body);
//     if (!validation.success) {
//       return c.json({ 
//         error: "Invalid request body", 
//         details: validation.error.format() 
//       }, 400);
//     }

//     const db = getDB(c);

//     // Remove undefined values and add updated timestamp
//     const cleanedData = Object.fromEntries(
//       Object.entries(validation.data).filter(([_, v]) => v !== undefined)
//     );

//     if (Object.keys(cleanedData).length === 0) {
//       return c.json({ error: "No valid fields to update" }, 400);
//     }

//     const updateData = {
//       ...cleanedData,
//       updatedAt: new Date().toISOString(),
//     };

//     // For D1, we need to handle the lack of .returning() support
//     // First check if the event exists
//     const existingEvent = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    
//     if (existingEvent.length === 0) {
//       return c.json({ error: "Event not found" }, 404);
//     }

//     // Perform the update
//     await db.update(events).set(updateData).where(eq(events.id, eventId));

//     // Get the updated event
//     const updatedEvent = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

//     return c.json({ 
//       message: "Event updated successfully", 
//       event: updatedEvent[0] 
//     });

//   } catch (error: any) {
//     console.error("Update event error:", error);
    
//     if (error.message?.includes("UNIQUE constraint failed")) {
//       return c.json({ 
//         error: "Event with this slug already exists" 
//       }, 409);
//     }
    
//     if (error.message?.includes("Database connection not available")) {
//       return c.json({ 
//         error: "Database connection error" 
//       }, 500);
//     }
    
//     return c.json({ 
//       error: "Failed to update event", 
//       details: error.message 
//     }, 500);
//   }
// };

// export const deleteEventbyId = async (c: Context) => {
//   try {
//     const eventId = Number(c.req.param("eventId"));
//     if (isNaN(eventId) || eventId <= 0) {
//       return c.json({ error: "Invalid event ID" }, 400);
//     }

//     const db = getDB(c);

//     // First check if the event exists
//     const existingEvent = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    
//     if (existingEvent.length === 0) {
//       return c.json({ error: "Event not found" }, 404);
//     }

//     // Perform the delete
//     await db.delete(events).where(eq(events.id, eventId));

//     return c.json({ 
//       message: "Event deleted successfully", 
//       event: existingEvent[0] 
//     });

//   } catch (error: any) {
//     console.error("Delete event error:", error);
    
//     if (error.message?.includes("Database connection not available")) {
//       return c.json({ 
//         error: "Database connection error" 
//       }, 500);
//     }
    
//     return c.json({ 
//       error: "Failed to delete event", 
//       details: error.message 
//     }, 500);
//   }
// };

// // Additional helper function to get event by ID
// export const getEventById = async (c: Context) => {
//   try {
//     const eventId = Number(c.req.param("eventId"));
//     if (isNaN(eventId) || eventId <= 0) {
//       return c.json({ error: "Invalid event ID" }, 400);
//     }

//     const db = getDB(c);
//     const event = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

//     if (event.length === 0) {
//       return c.json({ error: "Event not found" }, 404);
//     }

//     return c.json({ event: event[0] });

//   } catch (error: any) {
//     console.error("Get event error:", error);
    
//     if (error.message?.includes("Database connection not available")) {
//       return c.json({ 
//         error: "Database connection error" 
//       }, 500);
//     }
    
//     return c.json({ 
//       error: "Failed to retrieve event", 
//       details: error.message 
//     }, 500);
//   }
// };

// // Helper function to get all events
// export const getAllEvents = async (c: Context) => {
//   try {
//     const db = getDB(c);
//     const allEvents = await db.select().from(events);

//     return c.json({ 
//       events: allEvents,
//       count: allEvents.length 
//     });

//   } catch (error: any) {
//     console.error("Get all events error:", error);
    
//     if (error.message?.includes("Database connection not available")) {
//       return c.json({ 
//         error: "Database connection error" 
//       }, 500);
//     }
    
//     return c.json({ 
//       error: "Failed to retrieve events", 
//       details: error.message 
//     }, 500);
//   }
// };