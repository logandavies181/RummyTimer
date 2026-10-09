import type { Game } from './game.ts'

export type SidebarOptions = {
  root: HTMLElement
  menu: HTMLButtonElement
  scrim: HTMLElement
  close: HTMLButtonElement
  playerCount: HTMLSelectElement
  duration: HTMLSelectElement
  reset: HTMLButtonElement
  onPlayerCountChange: (playerCount: number) => void
  onDurationChange: (durationMs: number) => void
  onReset: () => void
}

export type Sidebar = {
  render: (game: Game) => void
}

export function mountSidebar(options: SidebarOptions): Sidebar {
  let open = false

  const setOpen = (next: boolean) => {
    open = next
    options.root.classList.toggle('is-open', open)
    options.root.setAttribute('aria-hidden', `${!open}`)
    options.menu.setAttribute('aria-expanded', `${open}`)
    options.scrim.hidden = !open
  }

  options.menu.addEventListener('click', () => setOpen(!open))
  options.close.addEventListener('click', () => setOpen(false))
  options.scrim.addEventListener('click', () => setOpen(false))
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false)
  })
  options.playerCount.addEventListener('change', () => options.onPlayerCountChange(Number(options.playerCount.value)))
  options.duration.addEventListener('change', () => options.onDurationChange(Number(options.duration.value)))
  options.reset.addEventListener('click', options.onReset)

  setOpen(false)

  return {
    render(game) {
      options.playerCount.value = `${game.playerCount}`
      options.duration.value = `${game.durationMs}`
    },
  }
}
