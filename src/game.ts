export type GameConfig = {
  playerCount: number
  durationMs: number
}

export type Game = {
  playerCount: number
  activeIndex: number
  durationMs: number
  remainingMs: number
  sinceMs: number
  running: boolean
}

export const defaultConfig: GameConfig = { playerCount: 3, durationMs: 30_000 }

export function createGame(config: GameConfig, now: number): Game {
  return {
    playerCount: config.playerCount,
    activeIndex: 0,
    durationMs: config.durationMs,
    remainingMs: config.durationMs,
    sinceMs: now,
    running: true,
  }
}

export function timeLeft(game: Game, now: number): number {
  if (!game.running) return game.remainingMs
  return Math.max(0, game.remainingMs - (now - game.sinceMs))
}

export function advanceTurn(game: Game, now: number): Game {
  return {
    ...game,
    activeIndex: (game.activeIndex + 1) % game.playerCount,
    remainingMs: game.durationMs,
    sinceMs: now,
  }
}

export function toggleRunning(game: Game, now: number): Game {
  if (game.running) {
    return { ...game, running: false, remainingMs: timeLeft(game, now) }
  }
  const remainingMs = game.remainingMs > 0 ? game.remainingMs : game.durationMs
  return { ...game, running: true, remainingMs, sinceMs: now }
}

export function expire(game: Game): Game {
  return { ...game, running: false, remainingMs: 0 }
}

export function resetGame(game: Game, now: number): Game {
  return { ...game, activeIndex: 0, remainingMs: game.durationMs, sinceMs: now }
}

export function setPlayerCount(game: Game, playerCount: number, now: number): Game {
  return {
    ...game,
    playerCount,
    activeIndex: game.activeIndex % playerCount,
    remainingMs: game.durationMs,
    sinceMs: now,
  }
}

export function setDuration(game: Game, durationMs: number, now: number): Game {
  return { ...game, durationMs, remainingMs: durationMs, sinceMs: now }
}

if (typeof Deno !== 'undefined') {
  const { assertEquals } = await import('@std/assert')

  Deno.test('a new game gives the first player a full turn', () => {
    assertEquals(createGame({ playerCount: 4, durationMs: 60_000 }, 1000), {
      playerCount: 4,
      activeIndex: 0,
      durationMs: 60_000,
      remainingMs: 60_000,
      sinceMs: 1000,
      running: true,
    })
  })

  Deno.test('timeLeft counts down while running and holds still while paused', () => {
    const game = createGame(defaultConfig, 1000)
    assertEquals(timeLeft(game, 3500), 27_500)
    assertEquals(timeLeft(toggleRunning(game, 3500), 9000), 27_500)
  })

  Deno.test('timeLeft stops at zero', () => {
    const game = createGame(defaultConfig, 0)
    assertEquals(timeLeft(game, defaultConfig.durationMs + 5000), 0)
  })

  Deno.test('advanceTurn moves to the next player and refills the turn', () => {
    let game = createGame({ playerCount: 3, durationMs: 30_000 }, 0)
    game = advanceTurn(game, 5000)
    assertEquals(game.activeIndex, 1)
    assertEquals(timeLeft(game, 5000), 30_000)
    game = advanceTurn(advanceTurn(game, 6000), 7000)
    assertEquals(game.activeIndex, 0)
    assertEquals(timeLeft(game, 7000), 30_000)
  })

  Deno.test('a spent turn restarts when the timer is toggled again', () => {
    const expired = expire(createGame(defaultConfig, 0))
    const resumed = toggleRunning(expired, 1000)
    assertEquals(resumed.running, true)
    assertEquals(resumed.remainingMs, defaultConfig.durationMs)
  })

  Deno.test('pausing an expired turn and resuming it also restarts the turn', () => {
    const paused = toggleRunning(expire(createGame(defaultConfig, 0)), 1000)
    const resumed = toggleRunning(paused, 2000)
    assertEquals(resumed.remainingMs, defaultConfig.durationMs)
    assertEquals(resumed.running, true)
  })

  Deno.test('resetGame returns to the first player with a full clock', () => {
    const game = advanceTurn(createGame(defaultConfig, 0), 5000)
    assertEquals(resetGame(game, 9000).activeIndex, 0)
    assertEquals(timeLeft(resetGame(game, 9000), 9000), defaultConfig.durationMs)
  })

  Deno.test('setPlayerCount keeps the active player in range', () => {
    let game = createGame({ playerCount: 5, durationMs: 30_000 }, 0)
    for (let i = 0; i < 4; i++) game = advanceTurn(game, 0)
    assertEquals(game.activeIndex, 4)
    assertEquals(setPlayerCount(game, 3, 0).activeIndex, 1)
  })

  Deno.test('setDuration restarts the turn with the new length', () => {
    const game = advanceTurn(createGame(defaultConfig, 0), 5000)
    const retimed = setDuration(game, 60_000, 9000)
    assertEquals(retimed.durationMs, 60_000)
    assertEquals(timeLeft(retimed, 9000), 60_000)
    assertEquals(retimed.activeIndex, 1)
  })
}
