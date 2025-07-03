import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { eventInfo  } from '../db/schema';

// ✅ New: Event creation endpoint
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
      message: 'Event !',
      data: {
        id: result[0].id,
        submittedAt: result[0].createdAt
      }
    });

  } catch (error) {
    console.error('Event creation Failed:', error);
    return c.json({ success: false, message: 'Internal server error. Please try again later.' }, 500);
  }
};

