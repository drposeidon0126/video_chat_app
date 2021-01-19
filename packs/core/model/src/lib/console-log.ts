export class PeekConsoleLog {
  trace(...args: any[]) {
    // eslint-disable-next-line no-console
    console.trace(...args)
  }

  debug(...args: any[]) {
    // eslint-disable-next-line no-console
    console.debug(...args)
  }

  info(...args: any[]) {
    // eslint-disable-next-line no-console
    console.info(...args)
  }

  warning(...args: any[]) {
    // eslint-disable-next-line no-console
    console.warn(...args)
  }

  error(...args: any[]) {
    // eslint-disable-next-line no-console
    console.error(...args)
  }
}
