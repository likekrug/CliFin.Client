export async function ensureGoogleMapsLoaded(): Promise<typeof google> {
  if (window.google?.maps)
    return window.google

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('#google-maps-script')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      if (window.google?.maps)
        return resolve()

      return
    }

    const script = document.createElement('script')

    script.id = 'google-maps-script'

    // ✅ 언어/지역 영어 기준
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&language=en&region=US`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Google Maps failed to load.'))
    document.head.appendChild(script)
  })

  ;(google.maps as any).setOptions({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  await google.maps.importLibrary('maps')
  await google.maps.importLibrary('places')

  return window.google
}
