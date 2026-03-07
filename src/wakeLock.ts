let wakeLock: WakeLockSentinel | null = null

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request("screen")
    wakeLock.addEventListener("release", () => {
      console.log("Screen Wake Lock was released.")
    })
  } catch (_err) {
    const err = _err as Error
    console.error(`Wake Lock request failed: ${err.name}, ${err.message}`)
  }
}

const handleVisibilityChange = () => {
  if (wakeLock !== null && document.visibilityState === "visible") {
    requestWakeLock()
  }
}

document.addEventListener("click", requestWakeLock)
// Re-request wake lock when the tab becomes visible again
document.addEventListener("visibilitychange", handleVisibilityChange)
