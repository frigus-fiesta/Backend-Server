import { Hono } from "hono";
// import {
//   createEvent,
//   updateEventbyId,
//   deleteEventbyId
// } from "../controllers/admin";
import { deleteEventById, eventCreate, updateEventById } from "../controllers/admin-event";

const adminRoutes = new Hono();

// POST /admin/events — Create new event
adminRoutes.post("/create-event", eventCreate);
adminRoutes.put('/events/update/:eventId', updateEventById);
adminRoutes.delete('/events/delete/:eventId', deleteEventById);


// PUT /admin/events/update/:eventId — Update event by ID
// adminRoutes.put("/events/update/:eventId", updateEventbyId);

// DELETE /admin/events/delete/:eventId — Delete event by ID
// adminRoutes.delete("/events/delete/:eventId", deleteEventbyId);

export default adminRoutes;
