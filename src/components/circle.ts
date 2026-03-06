import { html } from "../html.ts"

import { useEffect, useState } from "preact/hooks"

import { timeLeftTopic } from "../state.ts"

export default function CircleTimer({
  duration = 30, // seconds
  size = 120,
  strokeWidth = 10,
  color = "#4ade80",
}) {
  const [timeLeft, setTimeLeft] = useState(duration)

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    setInterval(() => {
      if (timeLeft <= 0) return

      // FIXME: probably not the best way to do things, but the interval here doesn't update otherwise
      setTimeLeft((t) => {
        const newTime = Math.max(0, t - 0.01)
        timeLeftTopic.Publish(newTime)
        return newTime
      })
    }, 10)
  }, [])

  const onClick = () => {
    setTimeLeft(duration)
  }

  const progress = timeLeft / duration
  const dashOffset = circumference * (1 - progress)

  return html`
    <div class="z-10">
      <svg
        onClick=${onClick}
        width=${size}
        height=${size}
      >
        <circle
          cx=${size / 2}
          cy=${size / 2}
          r=${radius}
          stroke="#e5e7eb"
          stroke-width=${strokeWidth}
          fill="#dff2fe"
        />

        <circle
          cx=${size / 2}
          cy=${size / 2}
          r=${radius}
          stroke=${color}
          stroke-width=${strokeWidth}
          fill="none"
          stroke-dasharray=${circumference}
          stroke-dashoffset=${dashOffset}
          stroke-linecap="butt"
          transform=${`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
    </div>
  `
}
