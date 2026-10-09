import { timeLeft, type Game } from './game.ts'
import { playerColor } from './pie.ts'

const ringRadius = 45
const ringCircumference = 2 * Math.PI * ringRadius

export type FaceOptions = {
  root: HTMLElement
  time: HTMLElement
  ring: SVGCircleElement
}

export type Face = {
  render: (game: Game, now: number) => void
}

export function mountFace(options: FaceOptions): Face {
  options.ring.style.strokeDasharray = `${ringCircumference}`

  return {
    render(game, now) {
      const remainingMs = timeLeft(game, now)
      const fraction = game.durationMs > 0 ? Math.min(1, remainingMs / game.durationMs) : 0

      options.time.textContent = secondsLabel(remainingMs)
      options.ring.style.strokeDashoffset = `${ringCircumference * (1 - fraction)}`
      options.ring.style.stroke = playerColor(game.activeIndex)
      options.root.classList.toggle('is-expired', remainingMs === 0)
    },
  }
}

function secondsLabel(remainingMs: number): string {
  return `${Math.ceil(remainingMs / 1000)}`
}

if (typeof Deno !== 'undefined') {
  const { assertEquals } = await import('@std/assert')

  Deno.test('secondsLabel counts down in whole seconds without skipping ahead', () => {
    assertEquals(secondsLabel(30_000), '30')
    assertEquals(secondsLabel(29_001), '30')
    assertEquals(secondsLabel(29_000), '29')
    assertEquals(secondsLabel(500), '1')
    assertEquals(secondsLabel(0), '0')
  })
}
