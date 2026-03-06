import { useState } from "preact/hooks"
import { html } from "../html.ts"
import { timeLeftTopic } from "../state.ts"

export default function TimeNumber() {
  const [timeLeft2, setTimeLeft2] = useState(timeLeftTopic.value) // FIXME: hardcoded

  timeLeftTopic.Subscribe("timeNumber", setTimeLeft2)

  return html`${formatTimeLeft(timeLeft2)}`
}

function formatTimeLeft(n: number): number {
  return Math.floor(n + 0.9) // Hackily not just immediately go to 29
}
