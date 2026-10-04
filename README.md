# cors proxy

**A lightweight CORS proxy built with Hono and designed for Vercel runtime. It lets browser-based apps request third-party APIs without running into browser cross-origin restrictions.**

## Why this project exists

**Many public APIs and static resources do not send the CORS headers required by browsers. This project acts as a simple pass-through proxy:**

- **receives a request from the browser**
- **forwards it to a target URL using the `u` query parameter**
- **adds permissive CORS headers to the response**
- **returns the target response body and status code**

## Features

- **Proxy any URL through a single endpoint**
- **Supports `GET`, `POST`, `PUT`, `DELETE`, and `OPTIONS`**
- **Adds `Access-Control-Allow-Origin: *`**
- **Preserves target response status and payload**
- **Handles missing or invalid target URLs cleanly**

### Proxy route

- **`ANY /v2/cors?u={target}` - proxy the request to the provided URL**

**example:**

```bash
https://anycors.vercel.app/v2/cors?u=https://api.xyz.com/data
```

**example in JavaScript:**

```js
const res = await fetch('https://anycors.vercel.app/v2/cors?u=' + encodeURIComponent('https://api.xyz.com/data'))
const data = await res.json()
console.log(data)
```

### Request method handling

**The proxy forwards the incoming HTTP method to the target URL, including request bodies for methods that allow them. If the incoming request is `OPTIONS`, the server responds with a 204 status and CORS headers.**

## Request flow

```text
Browser -> /v2/cors?u=https://api.xyz.com/data
        -> proxy fetches the target URL
        -> returns proxied response with CORS headers
```

## Notes and behavior

- **The `u` query parameter is required.**
- **Requests without `u` return `400 Missing "u" query parameter`.**
- **Proxy errors return a `500` response with the underlying fetch error message.**
- **The proxy strips `host` and some transfer-related headers before forwarding.**

