import type { Game } from './game.ts'

const svgNamespace = 'http://www.w3.org/2000/svg'
const pieSize = 100

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
      const wedges: SVGPathElement[] = []

      for (let index = 0; index < game.playerCount; index++) {
        const wedge = document.createElementNS(svgNamespace, 'path')
        wedge.setAttribute('d', wedgePath({ index, count: game.playerCount, size: pieSize }))
        wedge.setAttribute('fill', playerColor(index))

        if (index === game.activeIndex) {
          wedge.classList.add('is-active')
          wedge.addEventListener('click', options.onAdvance)
          wedge.append(label('End turn'))
        }

        wedges.push(wedge)
      }

      options.svg.replaceChildren(...wedges)
    },
  }
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

function wedgePath(spec: WedgeSpec): string {
  const radius = spec.size / 2
  const startAngle = (spec.index / spec.count) * 2 * Math.PI - Math.PI / 2
  const endAngle = ((spec.index + 1) / spec.count) * 2 * Math.PI - Math.PI / 2
  const x1 = round(radius + radius * Math.cos(startAngle))
  const y1 = round(radius + radius * Math.sin(startAngle))
  const x2 = round(radius + radius * Math.cos(endAngle))
  const y2 = round(radius + radius * Math.sin(endAngle))
  return `M${round(radius)} ${round(radius)}L${x1} ${y1}A${radius} ${radius} 0 0 1 ${x2} ${y2}Z`
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

  Deno.test('playerColor wraps around the palette', () => {
    assertEquals(playerColor(0), playerColors[0])
    assertEquals(playerColor(playerColors.length), playerColors[0])
    assertEquals(playerColor(playerColors.length + 2), playerColors[2])
  })
}
