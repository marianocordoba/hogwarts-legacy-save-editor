import { dialog } from "electron"
import path from 'path'
import fsPromises from 'fs/promises'
import context from "../lib/context"

export const exportDatabase = async (): Promise<any> => {
  const dbName = context.get('dbName')
  const dbPath = context.get('dbPath')

  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Export Database',
    defaultPath: path.join(process.env.USERPROFILE, 'Desktop', dbName),
  })

  if (canceled) return

  await fsPromises.copyFile(dbPath, filePath)
}
