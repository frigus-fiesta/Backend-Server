import { Hono } from 'hono';
import { getAllEvents, submitContactUsForm, subscribeToNewsletter } from '../controllers/general';

const generalRoutes = new Hono();

// Newsletter subscription route
generalRoutes.post('/newsletter/subscribe', subscribeToNewsletter);
generalRoutes.post('/contactus',submitContactUsForm);
generalRoutes.get('/get-all-events',getAllEvents);

export default generalRoutes;