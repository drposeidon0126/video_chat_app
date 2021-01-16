export type WithTarget<T = HTMLElement> = Event & {
  target: T
}
