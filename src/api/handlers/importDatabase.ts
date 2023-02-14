import { dialog } from "electron"
import path from 'path'
import SQLiteClient from 'better-sqlite3'
import type { Database } from "better-sqlite3"
import context from "../lib/context"

export const importDatabase = async (): Promise<any> => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Import Database',
    defaultPath: path.join(process.env.USERPROFILE, 'Desktop'),
  })

  if (canceled) return

  const dbPath = filePaths[0]
  const dbName = path.basename(dbPath)

  const dbClient: Database = context.get('dbClient')
  dbClient.close()

  context.set('dbName', dbName)
  context.set('dbPath', dbPath)
  context.set('dbClient', new SQLiteClient(dbPath))
}
