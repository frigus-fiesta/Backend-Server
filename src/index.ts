import { Hono } from 'hono'
import { Context } from 'hono'

const app = new Hono<{ Bindings: Bindings }>()

type Bindings = {
  DB: D1Database
}

app.get('/', (c:Context) => {
  return c.text('Hello Hono!')
})

app.get('/customers',(c:Context)=>{
  return c.json([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' }
  ])
})


app.get('/customers/:id', (c:Context)=>{
  const customerId = c.req.param('id')
  return c.json([{id: customerId, name: 'something'}])
})

app.get('/customers-from-db',async (c:Context)=>{
  const db = c.env.DB
  const result = await db.prepare('SELECT * FROM customers').all()
  return c.json(result.results)
})

export default app