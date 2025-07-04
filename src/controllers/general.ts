import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { newsletterSubscribers, contactUs, eventInfo, appoitmentBooking  } from '../db/schema';

export const subscribeToNewsletter = async (c: Context) => {
  try {
    // Get the database instance from the context
    const db = drizzle(c.env.DB);
    
    // Extract email from request body
    const body = await c.req.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return c.json(
        {
          success: false,
          message: 'Email is required'
        },
        400
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json(
        {
          success: false,
          message: 'Please provide a valid email address'
        },
        400
      );
    }

    // Check if email already exists
    const existingSubscriber = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email.toLowerCase()))
      .limit(1);

    if (existingSubscriber.length > 0) {
      // If user exists but is unsubscribed, resubscribe them
      if (!existingSubscriber[0].subscribed) {
        await db
          .update(newsletterSubscribers)
          .set({
            subscribed: true,
            createdAt: new Date().toISOString()
          })
          .where(eq(newsletterSubscribers.email, email.toLowerCase()));

        return c.json({
          success: true,
          message: 'Successfully resubscribed to newsletter!'
        });
      }

      return c.json(
        {
          success: false,
          message: 'Email is already subscribed to the newsletter'
        },
        409
      );
    }

    // Insert new subscriber
    const result = await db
      .insert(newsletterSubscribers)
      .values({
        email: email.toLowerCase(),
        subscribed: true,
        createdAt: new Date().toISOString()
      })
      .returning();

    return c.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        id: result[0].id,
        email: result[0].email,
        subscribedAt: result[0].createdAt
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    // Handle unique constraint violation (in case of race condition)
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return c.json(
        {
          success: false,
          message: 'Email is already subscribed to the newsletter'
        },
        409
      );
    }

    return c.json(
      {
        success: false,
        message: 'Internal server error. Please try again later.'
      },
      500
    );
  }
};

// ✅ New: Contact Us Form Submission
export const submitContactUsForm = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const { name, email, subject, description } = body;

    // Basic validation
    if (!name || !email || !subject || !description) {
      return c.json({ success: false, message: 'All fields are required.' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ success: false, message: 'Invalid email address.' }, 400);
    }

    const result = await db.insert(contactUs).values({
      name,
      email: email.toLowerCase(),
      subject,
      description,
      createdAt: new Date().toISOString()
    }).returning();

    return c.json({
      success: true,
      message: 'Your message has been received!',
      data: {
        id: result[0].id,
        submittedAt: result[0].createdAt
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return c.json({ success: false, message: 'Internal server error. Please try again later.' }, 500);
  }
};


export const getAllEvents = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);

    const events = await db.select().from(eventInfo).orderBy(eventInfo.createdAt);

    return c.json({
      success: true,
      message: 'Events retrieved successfully.',
      data: events
    });
    
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return c.json({
      success: false,
      message: 'Internal server error while fetching events.'
    }, 500);
  }
};


export const getEventBySlug = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const slug = c.req.param('slug');

    if (!slug) {
      return c.json({ success: false, message: 'Event slug is required.' }, 400);
    }

    const event = await db
      .select()
      .from(eventInfo)
      .where(eq(eventInfo.slug, slug))
      .limit(1);

    if (event.length === 0) {
      return c.json({ success: false, message: 'Event not found.' }, 404);
    }

    return c.json({
      success: true,
      message: 'Event retrieved successfully.',
      data: event[0]
    });

  } catch (error) {
    console.error('Failed to fetch event by slug:', error);
    return c.json({
      success: false,
      message: 'Internal server error while fetching event.'
    }, 500);
  }
}

export const bookAppointment = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const { name, email, phone, date, time, services, description } = body;

    // Basic Validation
    if (!name || !email || !phone || !date || !time || !services) {
      return c.json({ success: false, message: 'All fields are required.' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ success: false, message: 'Invalid email address.' }, 400);
    }

    // Insert into appointmentBooking table
    const result = await db.insert(appoitmentBooking).values({
      name,
      email: email.toLowerCase(),
      phone,
      date, // ISO format
      time, // ISO format
      services: JSON.stringify(services), // Store as JSON
      description: description || '',
      createdAt: new Date().toISOString()
    }).returning();

    return c.json({
      success: true,
      message: 'Appointment booked successfully!',
      data: {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        phone: result[0].phone,
        date: result[0].date,
        time: result[0].time,
        services: JSON.parse(result[0].services),
        description: result[0].description,
        createdAt: result[0].createdAt
      }
    });

  } catch (error) {
    console.error('Appointment booking error:', error);
    return c.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, 500);
  }
};
