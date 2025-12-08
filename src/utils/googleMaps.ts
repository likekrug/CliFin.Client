// src/utils/googleMaps.ts
export async function ensureGoogleMapsLoaded(): Promise<typeof google> {
  if (window.google?.maps)
    return window.google

  await new Promise<void>((resolve, reject) => {
    const existing = document.getElementById('google-maps-script') as HTMLScriptElement
    if (existing) {
      existing.onload = () => resolve()

      return
    }

    const script = document.createElement('script')

    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places&v=weekly&language=en&region=US`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Google Maps failed to load'))
    document.head.appendChild(script)
  })

  await google.maps.importLibrary('maps')
  await google.maps.importLibrary('places')
  await google.maps.importLibrary('marker')

  return window.google
}
