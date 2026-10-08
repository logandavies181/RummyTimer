import {
  advanceTurn,
  createGame,
  defaultConfig,
  expire,
  resetGame,
  setDuration,
  setPlayerCount,
  timeLeft,
  toggleRunning,
  type Game,
} from './src/game.ts'
import { mountFace } from './src/face.ts'
import { mountPie } from './src/pie.ts'
import { mountSidebar } from './src/sidebar.ts'
import { startWakeLock } from './src/wakelock.ts'

function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (element === null) throw new Error(`missing ${selector}`)
  return element
}

let game = createGame(defaultConfig, Date.now())
let frameId = 0

const pie = mountPie({
  svg: requiredElement<SVGSVGElement>('#pie'),
  onAdvance: () => setGame(advanceTurn(game, Date.now())),
})

const face = mountFace({
  root: requiredElement<HTMLElement>('#face'),
  time: requiredElement<HTMLElement>('#face-time'),
  ring: requiredElement<SVGCircleElement>('#face-ring'),
  toggle: requiredElement<HTMLButtonElement>('#toggle-button'),
  onToggle: () => setGame(toggleRunning(game, Date.now())),
})

const sidebar = mountSidebar({
  root: requiredElement<HTMLElement>('#sidebar'),
  menu: requiredElement<HTMLButtonElement>('#menu-button'),
  scrim: requiredElement<HTMLElement>('#scrim'),
  close: requiredElement<HTMLButtonElement>('#close-button'),
  playerCount: requiredElement<HTMLSelectElement>('#player-count'),
  duration: requiredElement<HTMLSelectElement>('#turn-duration'),
  reset: requiredElement<HTMLButtonElement>('#reset-button'),
  onPlayerCountChange: (playerCount) => setGame(setPlayerCount(game, playerCount, Date.now())),
  onDurationChange: (durationMs) => setGame(setDuration(game, durationMs, Date.now())),
  onReset: () => setGame(resetGame(game, Date.now())),
})

function setGame(next: Game): void {
  game = next
  render()
}

function render(): void {
  pie.render(game)
  face.render(game, Date.now())
  sidebar.render(game)
  scheduleTick()
}

function scheduleTick(): void {
  cancelAnimationFrame(frameId)
  if (game.running) frameId = requestAnimationFrame(tick)
}

function tick(): void {
  const now = Date.now()
  if (timeLeft(game, now) === 0) {
    setGame(expire(game))
    return
  }
  face.render(game, now)
  frameId = requestAnimationFrame(tick)
}

render()
startWakeLock()
