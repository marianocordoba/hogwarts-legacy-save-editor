import { ipcMain} from "electron"
import * as handlers from "./handlers"

export const initAPI = async () => {
  for (const [handlerName, handler] of Object.entries(handlers)) {
    ipcMain.handle(handlerName, handler)
  }
}
