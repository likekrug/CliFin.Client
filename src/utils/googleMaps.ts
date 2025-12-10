// src/utils/googleMaps.ts

let loadPromise: Promise<typeof google> | null = null

export function ensureGoogleMapsLoaded(): Promise<typeof google> {
  if (loadPromise)
    return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    // 이미 로드된 경우
    if (window.google?.maps) {
      resolve(window.google)

      return
    }

    const script = document.createElement('script')

    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places&v=weekly&language=en&region=US`
    script.async = true
    script.defer = true

    script.onload = () => {
      if (window.google?.maps)
        resolve(window.google)

      else
        reject(new Error('Google Maps loaded but no google.maps found'))
    }

    script.onerror = () => reject(new Error('Google Maps failed to load'))

    document.head.appendChild(script)
  })

  return loadPromise
}
