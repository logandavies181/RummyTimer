import { html } from "../html.ts";

import { useEffect, useState } from "preact/hooks";

export default function CircleTimer({
  duration = 10, // seconds
  size = 120,
  strokeWidth = 10,
  color = "#4ade80",
}) {
  const [timeLeft, setTimeLeft] = useState(duration);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 0.05));
    }, 50);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const progress = timeLeft / duration;
  const dashOffset = circumference * (1 - progress);

  return html`
    <svg width=${size} height=${size}>
      <circle
        cx=${size / 2}
        cy=${size / 2}
        r=${radius}
        stroke="#e5e7eb"
        stroke-width=${strokeWidth}
        fill="none"
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
        stroke-linecap="round"
        transform=${`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  `
}
