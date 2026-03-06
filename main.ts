import { render } from "preact"

import { html } from "./src/html.ts"
import { Navbar } from "./src/components/navbar.ts"
import CircleTimer from "./src/components/circle.ts"
import Sidebar from "./src/components/sidebar.ts"
import PieSegments from "./src/components/pieSegments.ts";
import TimeNumber from "./src/components/timeNumber.ts";

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("sw.js", { scope: "/harmonies-planner/" })
// }

function App() {
  return html`
    <div class="touch-manipulation flex grow flex-col min-w-screen min-h-screen">
      <${Navbar} />
      <main class="flex grow flex-col items-center justify-center min-h-full min-w-full overflow-hidden">
        <div class="relative flex grow flex-col items-center justify-center min-h-full min-w-full overflow-hidden">
          <div class="absolute z-10" >
            <${CircleTimer} />
          </div>
          <div class="absolute" >
            <${PieSegments} />
          </div>
          <div class="absolute z-20 text-lg" >
            <${TimeNumber} />
          </div>
        </div>
        <${Sidebar} />
      </main>
    </div>
  `
}

render(html`<${App} />`, document.body)
