export async function waitForGoogleMaps(maxWaitTime = 10000): Promise<void> {
  const startTime = Date.now()

  while (!window.google?.maps) {
    if (Date.now() - startTime > maxWaitTime) {
      throw new Error("Google Maps API failed to load within timeout")
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}
