import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event) {
  try {
    // Try to get the asset from KV
    return await getAssetFromKV(event)
  } catch (e) {
    // If the asset is not found, return the index.html for client-side routing
    try {
      let notFoundResponse = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
      })

      return new Response(notFoundResponse.body, { ...notFoundResponse, status: 200 })
    } catch (e) {
      return new Response('An unexpected error occurred', { status: 500 })
    }
  }
}