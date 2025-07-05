// import { Hono } from 'hono'
// import { Context } from 'hono'

// const app = new Hono<{ Bindings: Bindings }>()

// type Bindings = {
//   DB: D1Database
// }

// app.get('/', (c:Context) => {
//   return c.text('Hello Hono!')
// })

// app.get('/customers',(c:Context)=>{
//   return c.json([
//     { id: 1, name: 'John Doe' },
//     { id: 2, name: 'Jane Smith' },
//     { id: 3, name: 'Alice Johnson' }
//   ])
// })


// app.get('/customers/:id', (c:Context)=>{
//   const customerId = c.req.param('id')
//   return c.json([{id: customerId, name: 'something'}])
// })

// app.get('/customers-from-db',async (c:Context)=>{
//   const db = c.env.DB
//   const result = await db.prepare('SELECT * FROM customers').all()
//   return c.json(result.results)
// })

// app.post('/add/customers-to-db', async (c:Context)=>{
//   const db = c.env.DB
//   const { name, email } = await c.req.json<{ name: string; email: string }>()

//   if (!name || !email) {
//     return c.json({ error: 'Name and email are required' }, 400)
//   }

//   const result = await db.prepare('INSERT INTO customers (name, email) VALUES (?, ?)')
//     .bind(name, email)
//     .run()

//   if (result.success) {
//     return c.json({ message: 'Customer added successfully' })
//   } else {
//     return c.json({ error: 'Failed to add customer' }, 500)
//   }
// })


// app.put('/update/customer/:id', async (c:Context)=>{
//   const db = c.env.DB
//   const customerId = c.req.param('id')
//   const { name, email } = await c.req.json<{ name: string; email: string }>()

//   if (!name || !email) {
//     return c.json({ error: 'Name and email are required' }, 400)
//   }

//   const result = await db.prepare('UPDATE customers SET name = ?, email = ? WHERE id = ?')
//     .bind(name, email, customerId)
//     .run()

//   if (result.success) {
//     return c.json({ message: 'Customer updated successfully' })
//   } else {
//     return c.json({ error: 'Failed to update customer' }, 500)
//   }
// });


// app.delete('/delete/customer/:id', async (c:Context)=>{
//   const db = c.env.DB
//   const customerId = c.req.param('id')

//   const result = await db.prepare('DELETE FROM customers WHERE id = ?')
//     .bind(customerId)
//     .run()

//   if (result.success) {
//     return c.json({ message: 'Customer deleted successfully' })
//   } else {
//     return c.json({ error: 'Failed to delete customer' }, 500)
//   }
// });

// export default app;

import { Hono } from "hono";
import { cors } from "hono/cors";
import adminRoutes from "./routes/admin";
import generalRoutes from "./routes/general";
import mailRoute from "./routes/mail";

const app = new Hono();

// Enable CORS with specific origins
app.use(
  '*',
  cors({
    origin: (origin) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://frigus-fiesta-main-website.pages.dev",
        "https://main-website-frigus-fiesta.vercel.app"
      ]
      // Allow requests with no origin (like curl or Postman)
      if (!origin) return "*"

      return allowedOrigins.includes(origin) ? origin : ""
    },
    allowHeaders: ['Content-Type'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    maxAge: 600,
    credentials: true
  })
);

// Mount routes
app.route("/admin", adminRoutes);
app.route("/general", generalRoutes);
app.route('/mail',mailRoute);

export default app;
