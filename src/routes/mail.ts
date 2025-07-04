// routes/mail.ts
import { Hono } from 'hono'
import { mail_server_1 } from '../controllers/mail-server-1'
import { mail_server_2 } from '../controllers/mail-server-2';

const mailRoute = new Hono()

mailRoute.post('/send-on-server-1', mail_server_1);
mailRoute.post('/send-on-server-2', mail_server_2);

export default mailRoute
