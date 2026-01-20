/**
 * WakiFin Cloudflare Worker
 * Проксує запити до Azure API контейнера через DNS ім'я
 * Розв'язує CORS та забезпечує HTTPS
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // ✅ Використовуємо DNS ім'я замість IP
  const apiUrl = 'http://wakifin-api-dns.italynorth.azurecontainer.io:3001'
  
  const url = new URL(request.url)
  const targetUrl = apiUrl + url.pathname + url.search

  console.log(`[WakiFin Proxy] ${request.method} ${targetUrl}`)

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    })
  }

  try {
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined
    })

    const response = await fetch(modifiedRequest)

    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    })

    modifiedResponse.headers.set('Access-Control-Allow-Origin', '*')
    modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return modifiedResponse
  } catch (error) {
    console.error('[WakiFin Proxy] Error:', error)
    return new Response(JSON.stringify({ 
      error: 'Backend proxy error', 
      message: error.message,
      backend: apiUrl
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}
