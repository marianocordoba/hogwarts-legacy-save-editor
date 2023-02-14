import { API } from "./preload"

declare namespace NodeJS {
  interface ProcessEnv {
    OPEN_DEVTOOLS: 'true' | 'false' | undefined
  }
}

declare global {
  declare const MAIN_WINDOW_WEBPACK_ENTRY: string
  declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

  interface Window {
    HLSE: API,
  }
}
