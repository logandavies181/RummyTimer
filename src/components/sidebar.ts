import { useState } from "preact/hooks"
import { html } from "../html.ts"
import { numPlayers, sidebarToggleTopic } from "../state.ts"

type EventTarget<T> = {
  target: {
    value: T
  }
}

export default function Sidebar() {
  const [show, setShow] = useState(false)

  const onClick = () => {
    setShow(!show)
  }

  sidebarToggleTopic.Subscribe("sidebar", onClick)

  const onInput = (e: EventTarget<number>) => {
    numPlayers.Publish(e.target.value | 0)
  }

  return html`
    <div
      id="drawer-form"
      class="bg-sky-100 fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${show
        ? ""
        : "-translate-x-full"} w-80"
      tabindex="-1"
    >
      <div class="pb-4 mb-5 flex items-center">
        <button
          onClick=${onClick}
          type="button"
          class="text-body bg-transparent hover:text-heading hover:bg-neutral-tertiary w-9 h-9 absolute top-2.5 end-2.5 flex items-center justify-center"
        >
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18 17.94 6M18 18 6.06 6"
            />
          </svg>
          <span class="sr-only">Close menu</span>
        </button>
      </div>
      <form
        class="mb-6 space-y-4"
        onInput=${onInput}
      >
        <div>
          <label
            for="numPlayers"
            class="block mb-2.5 text-sm font-medium text-heading"
            >Number of Players
          </label>
          <select
            id="numPlayers"
            class="block w-full px-3 py-2.5 text-heading text-sm shadow-xs"
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option
              value="4"
              selected
            >
              4
            </option>
          </select>
        </div>
      </form>
    </div>
  `
}
