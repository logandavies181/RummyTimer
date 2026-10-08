let sentinel: WakeLockSentinel | null = null

async function requestWakeLock(): Promise<void> {
  try {
    sentinel = await navigator.wakeLock.request('screen')
    sentinel.addEventListener('release', () => {
      sentinel = null
    })
  } catch {
    // Wake lock is best effort: it is unsupported or denied outside of some browsers and contexts.
  }
}

export function startWakeLock(): void {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') requestWakeLock()
  })
  requestWakeLock()
}
