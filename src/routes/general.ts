import { Hono } from 'hono';
import { bookAppointment, getAllEvents, getAllEventsFromCache, submitContactUsForm, subscribeToNewsletter } from '../controllers/general';

const generalRoutes = new Hono();

// Newsletter subscription route
generalRoutes.post('/newsletter/subscribe', subscribeToNewsletter);
generalRoutes.post('/contactus',submitContactUsForm);
generalRoutes.get('/get-all-events',getAllEvents);
generalRoutes.post('/book-appointment',bookAppointment)
generalRoutes.get('/get-all-events-from-cache',getAllEventsFromCache);

export default generalRoutes;