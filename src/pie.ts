import type { Game } from './game.ts'

const svgNamespace = 'http://www.w3.org/2000/svg'
const pieSize = 100
const pieCenter = pieSize / 2

const playerColors = ['#fb2c36', '#2b7fff', '#05df72', '#ffdf20', '#ad46ff', '#ff6900']

export type PieOptions = {
  svg: SVGSVGElement
  onAdvance: () => void
}

export type Pie = {
  render: (game: Game) => void
}

export function playerColor(index: number): string {
  return playerColors[index % playerColors.length]
}

export function mountPie(options: PieOptions): Pie {
  return {
    render(game) {
      const segments: SVGElement[] = []

      for (let index = 0; index < game.playerCount; index++) {
        const wedge = document.createElementNS(svgNamespace, 'path')
        wedge.setAttribute('d', wedgePath({ index, count: game.playerCount, size: pieSize }))
        wedge.setAttribute('fill', playerColor(index))

        if (index === game.activeIndex) {
          wedge.classList.add('is-active')
          wedge.addEventListener('click', options.onAdvance)
          wedge.append(label('End turn'))
        }

        segments.push(wedge)
      }

      for (let index = 0; index < game.playerCount; index++) {
        segments.push(divider({ index, count: game.playerCount, activeIndex: game.activeIndex }))
      }

      options.svg.replaceChildren(...segments)
    },
  }
}

type DividerSpec = {
  index: number
  count: number
  activeIndex: number
}

function divider(spec: DividerSpec): SVGLineElement {
  const edge = edgePoint(spec.index, spec.count, pieSize)
  const line = document.createElementNS(svgNamespace, 'line')
  line.setAttribute('x1', `${pieCenter}`)
  line.setAttribute('y1', `${pieCenter}`)
  line.setAttribute('x2', `${edge.x}`)
  line.setAttribute('y2', `${edge.y}`)

  if (spec.index === spec.activeIndex || spec.index === (spec.activeIndex + 1) % spec.count) {
    line.classList.add('is-active')
  }

  return line
}

function label(text: string): SVGTitleElement {
  const title = document.createElementNS(svgNamespace, 'title')
  title.textContent = text
  return title
}

type WedgeSpec = {
  index: number
  count: number
  size: number
}

type Point = {
  x: number
  y: number
}

function edgePoint(index: number, count: number, size: number): Point {
  const radius = size / 2
  const angle = (index / count) * 2 * Math.PI - Math.PI / 2
  return { x: round(radius + radius * Math.cos(angle)), y: round(radius + radius * Math.sin(angle)) }
}

function wedgePath(spec: WedgeSpec): string {
  const radius = spec.size / 2
  const start = edgePoint(spec.index, spec.count, spec.size)
  const end = edgePoint(spec.index + 1, spec.count, spec.size)
  return `M${round(radius)} ${round(radius)}L${start.x} ${start.y}A${radius} ${radius} 0 0 1 ${end.x} ${end.y}Z`
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}

if (typeof Deno !== 'undefined') {
  const { assertEquals } = await import('@std/assert')

  Deno.test('the first wedge starts at twelve o clock', () => {
    assertEquals(wedgePath({ index: 0, count: 4, size: 100 }), 'M50 50L50 0A50 50 0 0 1 100 50Z')
  })

  Deno.test('wedges run clockwise around the circle', () => {
    assertEquals(wedgePath({ index: 1, count: 4, size: 100 }), 'M50 50L100 50A50 50 0 0 1 50 100Z')
    assertEquals(wedgePath({ index: 2, count: 4, size: 100 }), 'M50 50L50 100A50 50 0 0 1 0 50Z')
    assertEquals(wedgePath({ index: 3, count: 4, size: 100 }), 'M50 50L0 50A50 50 0 0 1 50 0Z')
  })

  Deno.test('wedges shrink as players are added', () => {
    assertEquals(wedgePath({ index: 0, count: 6, size: 100 }), 'M50 50L50 0A50 50 0 0 1 93.3 25Z')
  })

  Deno.test('dividers run from the centre out to the rim', () => {
    assertEquals(edgePoint(0, 4, 100), { x: 50, y: 0 })
    assertEquals(edgePoint(1, 4, 100), { x: 100, y: 50 })
    assertEquals(edgePoint(2, 4, 100), { x: 50, y: 100 })
    assertEquals(edgePoint(3, 4, 100), { x: 0, y: 50 })
  })

  Deno.test('playerColor wraps around the palette', () => {
    assertEquals(playerColor(0), playerColors[0])
    assertEquals(playerColor(playerColors.length), playerColors[0])
    assertEquals(playerColor(playerColors.length + 2), playerColors[2])
  })
}
