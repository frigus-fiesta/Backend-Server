import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { eventInfo  } from '../db/schema';

//  Event creation endpoint
export const eventCreate = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const { title,
            description,
            slug,eventDate,
            tagline, 
            eventStatus, 
            category, hostedBy,
            venue = '', // Default to empty string if not provided
            imageGallery = '',
            eventPrice = 0, 
            ticketPricingList = '', 
            importantInfo         } = body;
    
    // Basic validation
    if (!title || !description || !slug || !eventDate || !tagline || !eventStatus || !category || !hostedBy || !importantInfo) {
      return c.json({ success: false, message: 'Missing one or more required fields: title, description, slug, eventDate, tagline, eventStatus, category, hostedBy, or importantInfo.' }, 400);
    }

    const result = await db.insert(eventInfo).values({
      title,
      description,
      slug,
      eventDate,
      tagline,
      eventStatus,
      category,
      hostedBy,
      venue,
      imageGallery,
      eventPrice,
      ticketPricingList,
      importantInfo,
      createdAt: new Date().toISOString()
    }).returning();

    return c.json({
      success: true,
      message: 'Event Created Successfully !',
      data: {
        id: result[0].id,
        CreatedAt: result[0].createdAt
      }
    });

  } catch (error) {
    console.error('Event creation Failed:', error);
    return c.json({ success: false, message: 'Internal server error. Please try again later.' }, 500);
  }
};

// update event By ID endpoint
export const updateEventById = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const eventId = c.req.param('eventId');

    if (!eventId || isNaN(Number(eventId))) {
      return c.json({ success: false, message: 'Invalid or missing event ID.' }, 400);
    }

    const existingEvent = await db
      .select()
      .from(eventInfo)
      .where(eq(eventInfo.id, Number(eventId)));

    if (existingEvent.length === 0) {
      return c.json({ success: false, message: `Event with ID ${eventId} not found.` }, 404);
    }

    const body = await c.req.json();

    // Use the schema's insert type to get correct typings
    type EventFields = typeof eventInfo.$inferInsert;

    // Define keys that can be updated
    const allowedKeys: (keyof EventFields)[] = [
      'title',
      'description',
      'slug',
      'eventDate',
      'tagline',
      'eventStatus',
      'category',
      'hostedBy',
      'venue',
      'imageGallery',
      'eventPrice',
      'ticketPricingList',
      'importantInfo'
    ];

    // Build the object with type safety
    const updatableFields: Partial<EventFields> = {};
    for (const key of allowedKeys) {
      if (key in body && body[key] !== undefined) {
        updatableFields[key] = body[key];
      }
    }

    if (Object.keys(updatableFields).length === 0) {
      return c.json({
        success: false,
        message: 'No valid fields provided for update.'
      }, 400);
    }

    updatableFields.updatedAt = new Date().toISOString();

    const result = await db
      .update(eventInfo)
      .set(updatableFields)
      .where(eq(eventInfo.id, Number(eventId)))
      .returning();

    return c.json({
      success: true,
      message: `Event with ID ${eventId} updated successfully.`,
      data: result[0]
    });

  } catch (error) {
    console.error('Error updating event:', error);
    return c.json({
      success: false,
      message: 'Internal server error. Please try again later.',
      error: (error as Error).message
    }, 500);
  }
};

// Delete event by ID endpoint
export const deleteEventById = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const eventId = c.req.param('eventId');

    if (!eventId || isNaN(Number(eventId))) {
      return c.json({ success: false, message: 'Invalid or missing event ID.' }, 400);
    }

    // Check if the event exists before deletion
    const existing = await db
      .select()
      .from(eventInfo)
      .where(eq(eventInfo.id, Number(eventId)));

    if (existing.length === 0) {
      return c.json({ success: false, message: `Event with ID ${eventId} not found.` }, 404);
    }

    // Delete the event
    await db
      .delete(eventInfo)
      .where(eq(eventInfo.id, Number(eventId)));

    return c.json({
      success: true,
      message: `Event with ID ${eventId} has been deleted.`
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    return c.json({
      success: false,
      message: 'Internal server error while deleting event.',
      error: (error as Error).message
    }, 500);
  }
};
