import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and } from 'drizzle-orm';
import { newsletterSubscribers, contactUs, eventInfo, appoitmentBooking, userProfiles, eventReviews  } from '../db/schema';
import { Redis } from '@upstash/redis/cloudflare';

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

const redis = new Redis({
  url: "https://evident-silkworm-49033.upstash.io",
  token: "Ab-JAAIjcDFjNDc3N2QzNDU0MTc0YmYzOWQwNmYyNzhmY2M4YjY2YXAxMA"
});

export const getAllEventsFromCache = async (c: Context) => {
  try {
    const cacheKey = 'events:all';

    // Try fetching from Redis
    const cached = await redis.get(cacheKey);
    if (cached) {
      return c.json({
        success: true,
        message: 'Events retrieved from cache.',
        data: cached
      });
    }

    // If cache miss, query D1
    const db = drizzle(c.env.DB);
    const events = await db.select().from(eventInfo).orderBy(eventInfo.createdAt);

    // Cache result in Redis for 60 seconds
    await redis.set(cacheKey, events, { ex: 60 });

    return c.json({
      success: true,
      message: 'Events retrieved from database.',
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

export const createProfile = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const { full_name, email, uuid, avatar_url='https://avatar.iran.liara.run/public/boy?username=[8]' } = body;

    // Basic Validation
    if (!full_name || !email  || !uuid ) {
      return c.json({ success: false, message: 'All fields are required.' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ success: false, message: 'Invalid email address.' }, 400);
    }

    // Insert into appointmentBooking table
    const result = await db.insert(userProfiles).values({
      uuid,
      full_name,
      email: email.toLowerCase(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      avatar_url,
    }).returning();

    return c.json({
      success: true,
      message: 'Profile create successfully!',
      data: {
        id: result[0].id,
        name: result[0].full_name,
        email: result[0].email,
        phone: result[0].phone,
        createdAt: result[0].created_at
      }
    });

  } catch (error) {
    console.error('Profile Creation error:', error);
    return c.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, 500);
  }
};

export const getAllProfiles = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);

    // Fetch all profiles from the database
    const profiles = await db.select().from(userProfiles).all();

    return c.json({
      success: true,
      message: 'Profiles fetched successfully!',
      data: profiles,
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return c.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, 500);
  }
};

export const getProfileByUUID = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const uuid = c.req.param('uuid'); // get the uuid from the route params

    if (!uuid) {
      return c.json({
        success: false,
        message: 'UUID is required.',
      }, 400);
    }

    // Fetch the user profile where uuid matches
    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.uuid, uuid))
      .get(); // `.get()` to fetch a single record

    if (!profile) {
      return c.json({
        success: false,
        message: 'Profile not found.',
      }, 404);
    }

    return c.json({
      success: true,
      message: 'Profile fetched successfully!',
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({
      success: false,
      message: 'Internal server error. Please try again later.',
    }, 500);
  }
};

export const updateProfileByUUID = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const uuid = c.req.param('uuid');
    const body = await c.req.json();

    if (!uuid) {
      return c.json({
        success: false,
        message: 'UUID is required.',
      }, 400);
    }

    // Only allow specific fields to be updated
    const allowedFields = [
      'full_name',
      'avatar_url',
      'phone',
      'address',
      'city',
      'state',
      'pincode',
      'email_notifications',
      'bio',
      'user_login_info',
      'email'
    ];

    const updates: Record<string, any> = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    // No valid fields to update
    if (Object.keys(updates).length === 0) {
      return c.json({
        success: false,
        message: 'No valid fields provided for update.',
      }, 400);
    }

    // Automatically update `updated_at` field
    updates['updated_at'] = new Date().toISOString();

    const result = await db
      .update(userProfiles)
      .set(updates)
      .where(eq(userProfiles.uuid, uuid));

    return c.json({
      success: true,
      message: 'Profile updated successfully!',
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return c.json({
      success: false,
      message: 'Internal server error. Please try again later.',
    }, 500);
  }
};


export const submitEventReview = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();
    const { uuid, review_of, comment, rate } = body;

    // Basic validation
    if (!uuid || !review_of || !comment || typeof rate === 'undefined') {
      return c.json({ success: false, message: 'All fields are required.' }, 400);
    }

    if (typeof rate !== 'number' || rate < 1 || rate > 5) {
      return c.json({ success: false, message: 'Rating must be between 1 and 5.' }, 400);
    }

    const existingReview = await db
      .select()
      .from(eventReviews)
      .where(
        and(
          eq(eventReviews.uuid, uuid),
          eq(eventReviews.review_of, review_of)
        )
      );

    if (existingReview.length > 0) {
      return c.json({
        success: false,
        message: 'You have already submitted a review for this event.',
      }, 409);
    }

    const result = await db
      .insert(eventReviews)
      .values({
        uuid,
        review_of,
        comment,
        rate,
        like_count: 0, // ✅ Always initialize to 0
        commented_on: new Date().toISOString()
      })
      .returning();

    return c.json({
      success: true,
      message: 'Your review has been submitted!',
      data: {
        id: result[0].id,
        submittedAt: result[0].commented_on
      }
    });

  } catch (error) {
    console.error('Review submission error:', error);
    return c.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, 500);
  }
};


export const getReviewsBySlug = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const slug = c.req.param('slug'); // extract slug from URL param

    if (!slug) {
      return c.json({
        success: false,
        message: 'Event slug is required.'
      }, 400);
    }

    const reviews = await db
      .select()
      .from(eventReviews)
      .where(eq(eventReviews.review_of, slug));

    return c.json({
      success: true,
      total: reviews.length,
      data: reviews
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return c.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, 500);
  }
};

export const getAllReviews = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);

    const reviews = await db
      .select()
      .from(eventReviews)
      .all();

    return c.json({
      success: true,
      total: reviews.length,
      data: reviews
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return c.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, 500);
  }
};

