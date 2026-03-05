import { render } from "preact"

import { html } from "./src/html.ts"
import { Navbar } from "./src/components/navbar.ts"
import CircleTimer from "./src/components/circle.ts"

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("sw.js", { scope: "/harmonies-planner/" })
// }

function App() {
  return html`
    <div class="touch-manipulation flex grow flex-col min-w-full min-h-full">
      <${Navbar} />
      <main class="flex grow flex-col justify-between min-w-full">
        <${CircleTimer} />
      </main>
    </div>
  `
}

render(html`<${App} />`, document.body)
