import { Hono } from 'hono';
import { bookAppointment,createProfile,
            getAllEvents, getAllEventsFromCache,
            getAllProfiles, getProfileByUUID, 
            submitContactUsForm, subscribeToNewsletter } from '../controllers/general';

const generalRoutes = new Hono();

// Newsletter subscription route
generalRoutes.post('/newsletter/subscribe', subscribeToNewsletter);
generalRoutes.post('/contactus',submitContactUsForm);
generalRoutes.get('/get-all-events',getAllEvents);
generalRoutes.post('/book-appointment',bookAppointment)
generalRoutes.get('/get-all-events-from-cache',getAllEventsFromCache);
generalRoutes.post('/create-profile',createProfile);
generalRoutes.get('/get-all-profiles', getAllProfiles);
generalRoutes.get('/get-user-profile-from-uuid/:uuid', getProfileByUUID);

export default generalRoutes;