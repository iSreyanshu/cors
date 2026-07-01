import { Hono } from 'hono'
import { handle } from '@hono/node-server/vercel'

const app = new Hono()

app.get('/', (c) => { return c.text('Hono CORS Proxy Running! Use: /v2/cors?u=YOUR_URL') })
app.get('/v2', (c) => { return c.text('Hono CORS Proxy Running! Use: /v2/cors?u=YOUR_URL') })

app.all('/v2/cors', async (c) => {
  const targetUrl = c.req.query('u')
  if (!targetUrl) { return c.text('Missing "u" query parameter', 400) }
  
  try {
    const headers = new Headers(c.req.raw.headers)
    headers.delete('host')
    const response = await fetch(targetUrl, {
      method: c.req.method,
      headers: headers,
      body: c.req.method !== 'GET' && c.req.method !== 'HEAD' ? await c.req.raw.blob() : undefined,
    })

    const resHeaders = new Headers(response.headers)
    resHeaders.set('Access-Control-Allow-Origin', '*')
    resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    resHeaders.set('Access-Control-Allow-Headers', '*')
    
    if (c.req.method === 'OPTIONS') { return new Response(null, { status: 204, headers: resHeaders }) }
    const body = await response.blob()
    return new Response(body, {
      status: response.status,
      headers: resHeaders,
    })

  } catch (error) { 
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.text(`Proxy Error: ${errorMessage}`, 500) 
  }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const OPTIONS = handle(app)
