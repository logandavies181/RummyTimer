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
}

export const defaultConfig: GameConfig = { playerCount: 3, durationMs: 30_000 }

export function createGame(config: GameConfig, now: number): Game {
  return {
    playerCount: config.playerCount,
    activeIndex: -1,
    durationMs: config.durationMs,
    remainingMs: config.durationMs,
    sinceMs: now,
  }
}

export function timeLeft(game: Game, now: number): number {
  if (game.activeIndex < 0) {
    return game.durationMs
  }
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

export function claimTurn(game: Game, index: number, now: number): Game {
  if (game.activeIndex < 0) {
    return {
      ...game,
      activeIndex: index % game.playerCount,
      remainingMs: game.durationMs,
      sinceMs: now,
    }
  }

  if (game.activeIndex === index) {
    return advanceTurn(game, now)
  }

  return game
}

export function expire(game: Game): Game {
  return { ...game, remainingMs: 0 }
}

export function resetGame(game: Game, now: number): Game {
  return { ...game, activeIndex: -1, remainingMs: game.durationMs, sinceMs: now }
}

export function setPlayerCount(game: Game, playerCount: number, now: number): Game {
  return {
    ...game,
    playerCount,
    activeIndex: game.activeIndex >= 0 ? game.activeIndex % playerCount : -1,
    remainingMs: game.durationMs,
    sinceMs: now,
  }
}

export function setDuration(game: Game, durationMs: number, now: number): Game {
  return { ...game, durationMs, remainingMs: durationMs, sinceMs: now }
}

if (typeof Deno !== 'undefined') {
  const { assertEquals } = await import('@std/assert')

  Deno.test('a new game starts with no active player', () => {
    assertEquals(createGame({ playerCount: 4, durationMs: 60_000 }, 1000), {
      playerCount: 4,
      activeIndex: -1,
      durationMs: 60_000,
      remainingMs: 60_000,
      sinceMs: 1000,
    })
  })

  Deno.test('timeLeft counts down as time passes', () => {
    const game = claimTurn(createGame(defaultConfig, 1000), 0, 1000)
    assertEquals(timeLeft(game, 3500), 27_500)
  })

  Deno.test('timeLeft stops at zero', () => {
    const game = claimTurn(createGame(defaultConfig, 0), 0, 0)
    assertEquals(timeLeft(game, defaultConfig.durationMs + 5000), 0)
  })

  Deno.test('claimTurn starts the first clicked player and refills the clock', () => {
    let game = createGame({ playerCount: 3, durationMs: 30_000 }, 0)
    game = claimTurn(game, 2, 5000)
    assertEquals(game.activeIndex, 2)
    assertEquals(timeLeft(game, 5000), 30_000)
    game = claimTurn(game, 2, 6000)
    assertEquals(game.activeIndex, 0)
    assertEquals(timeLeft(game, 6000), 30_000)
  })

  Deno.test('an expired turn stays expired until the turn advances', () => {
    const expired = expire({ ...createGame(defaultConfig, 0), activeIndex: 0, remainingMs: 0, sinceMs: 0 })
    assertEquals(timeLeft(expired, 5000), 0)
    const next = advanceTurn(expired, 6000)
    assertEquals(timeLeft(next, 6000), defaultConfig.durationMs)
  })

  Deno.test('resetGame returns to no active player with a full clock', () => {
    const game = claimTurn(createGame(defaultConfig, 0), 1, 5000)
    assertEquals(resetGame(game, 9000).activeIndex, -1)
    assertEquals(timeLeft(resetGame(game, 9000), 9000), defaultConfig.durationMs)
  })

  Deno.test('setPlayerCount keeps the active player in range when a turn exists', () => {
    let game = createGame({ playerCount: 5, durationMs: 30_000 }, 0)
    game = claimTurn(game, 4, 0)
    assertEquals(game.activeIndex, 4)
    assertEquals(setPlayerCount(game, 3, 0).activeIndex, 1)
  })

  Deno.test('setDuration restarts the active turn with the new length', () => {
    const game = claimTurn(createGame(defaultConfig, 0), 0, 5000)
    const retimed = setDuration(game, 60_000, 9000)
    assertEquals(retimed.durationMs, 60_000)
    assertEquals(timeLeft(retimed, 9000), 60_000)
    assertEquals(retimed.activeIndex, 0)
  })
}
