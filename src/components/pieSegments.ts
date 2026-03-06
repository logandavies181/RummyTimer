import { useState } from "preact/hooks";
import { html } from "../html.ts"
import { activePlayerTopic, numPlayersTopic, turnMoveTopic } from "../state.ts";

const colors = ["#fb2c36", "#2b7fff", "#05df72", "#ffdf20"]

export default function PieSegments() {
  const [activePlayer, setActivePlayer] = useState(activePlayerTopic.value)
  const [numPlayers, setNumPlayers] = useState(numPlayersTopic.value)

  activePlayerTopic.Subscribe("pieSegments", setActivePlayer)
  numPlayersTopic.Subscribe("pieSegments", setNumPlayers)

  return html`
    <div class="min-w-full min-h-full -z-10">
      <${pieSegments}
        segments="${numPlayers}"
        colors=${colors}
        activePlayer=${activePlayer}
      />
    </div>
  `
}

function pieSegments({ segments = 6, size = 240, colors = [], activePlayer = 0 }) {
  const r = size / 2
  const cx = r
  const cy = r

  const slices = []

  for (let i = 0; i < segments; i++) {
    const startAngle = (i / segments) * 2 * Math.PI
    const endAngle = ((i + 1) / segments) * 2 * Math.PI

    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)

    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0

    const path = `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `

    const onClickFactory = (idx: number) => {
      const _idx = idx
      return () => {
        console.log(`active is ${activePlayer}`)
        console.log(`i am ${_idx}`)
        if (_idx == activePlayer) {
          console.log("i am active")
          turnMoveTopic.Publish()
        }
      }
    }

    slices.push(
      html`<path
        d=${path}
        fill=${colors[i] || "none"}
        onClick=${onClickFactory(i)}
      />`,
    )

    if (i == activePlayer) {
      const r = 7
      const x1 = cx + r * Math.cos(startAngle)
      const y1 = cy + r * Math.sin(startAngle)

      const x2 = cx + r * Math.cos(endAngle)
      const y2 = cy + r * Math.sin(endAngle)

      const activePlayerArcPath = `
        M ${x1} ${y1}
        A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}
      `

      slices.push(
        html`<path
          d=${activePlayerArcPath}
          stroke=black
          fill=none
          onClick=${onClickFactory(i)}
        />`,
      )
    }
  }

  return html`
    <svg
      class="scale-[10] -z-50"
      width="100%"
      height="100%"
      viewBox=${`0 0 ${size} ${size}`}
      transform="rotate(${segments == 2 ? "0" : "-90"})"
    >
      ${slices}
    </svg>
  `
}
