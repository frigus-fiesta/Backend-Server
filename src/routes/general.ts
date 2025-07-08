import { Hono } from 'hono';
import { bookAppointment,createProfile,
            getAllAppointments,
            getAllEvents, getAllEventsFromCache,
            getAllProfiles, getAllReviews, getProfileByUUID, 
            getReviewsBySlug, 
            submitContactUsForm, submitEventReview, subscribeToNewsletter, 
            updateProfileByUUID} from '../controllers/general';

const generalRoutes = new Hono();

// General routes
generalRoutes.post('/newsletter/subscribe', subscribeToNewsletter);
generalRoutes.post('/contactus',submitContactUsForm);

generalRoutes.post('/book-appointment',bookAppointment)

generalRoutes.get('/get-all-events',getAllEvents);
generalRoutes.get('/get-all-events-from-cache',getAllEventsFromCache);

generalRoutes.post('/create-profile',createProfile);

// only called on admin Dashboard
generalRoutes.get('/get-all-profiles', getAllProfiles); 
generalRoutes.get("/get-all-reviews",getAllReviews);
generalRoutes.get('/get-all-appointments', getAllAppointments);

// called on admin and authenticated users
generalRoutes.get('/get-user-profile-from-uuid/:uuid', getProfileByUUID); 
generalRoutes.put('/profile/update/:uuid', updateProfileByUUID);

generalRoutes.get('/get-event-reviews/:slug', getReviewsBySlug );

generalRoutes.post('/submit-event-review', submitEventReview);

export default generalRoutes;