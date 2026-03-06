type Callback<T> = (t: T) => void

class Topic<T> {
  private callbacks = new Map<string, Callback<T>>()

  constructor(public value: T) {}

  public Subscribe(name: string, cb: Callback<T>) {
    this.callbacks.set(name, cb)
  }

  public Publish(t: T) {
    this.value = t
    this.callbacks.forEach((cb) => {
      cb(t)
    })
  }
}

export const duration = 30

export const sidebarToggleTopic = new Topic<void>(undefined)

export const activePlayerTopic = new Topic<number>(0)

export const numPlayersTopic = new Topic<number>(3)

export const timeLeftTopic = new Topic<number>(duration)

export const turnMoveTopic = new Topic<void>(undefined)

turnMoveTopic.Subscribe("incrementActivePlayer", () => {
  activePlayerTopic.Publish((activePlayerTopic.value + 1) % numPlayersTopic.value)
})
