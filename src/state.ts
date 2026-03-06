type Callback<T> = (t: T) => void

class Topic<T> {
  private callbacks = new Map<string, Callback<T>>()

  public Subscribe(name: string, cb: Callback<T>) {
    this.callbacks.set(name, cb)
  }

  public Publish(t: T) {
    this.callbacks.forEach((cb) => {
      cb(t)
    })
  }
}

export const sidebarToggleTopic = new Topic<void>

export const numPlayers = new Topic<number>

export const timeLeftTopic = new Topic<number>
