import { dialog } from "electron"
import path from 'path'
import fsPromises from 'fs/promises'
import SQLiteClient from 'better-sqlite3'
import context from "../lib/context"

export const openSave = async (): Promise<boolean> => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Open File',
    defaultPath: path.join(process.env.LOCALAPPDATA, '/Hogwarts Legacy/Saved/SaveGames/'),
    filters: [
      { name: 'Save files', extensions: ['sav'] },
      { name: 'All files', extensions: ['*'] },
    ]
  })

  if (canceled) return false

  const filePath = filePaths[0]

  const raw = await fsPromises.readFile(filePath)

  // Find the start of the SQLite database
  const dbStart = raw.indexOf(Buffer.from('SQLite format 3'))

  // Find the size of the SQLite database
  const dbSizeStart = dbStart - 4
  const dbSizeEnd = dbStart
  const dbSize = raw.subarray(dbSizeStart, dbSizeEnd).readInt32LE()

  // Extract the SQLite database
  const dbData = raw.subarray(dbStart, dbStart + dbSize)

  // Write the SQLite database to a temp file
  const dbName = path.parse(filePath).name + '.db'
  const tempPath = path.join(process.env.TEMP, dbName)
  await fsPromises.writeFile(tempPath, dbData)

  context.set('saveName', path.basename(filePath))
  context.set('savePath', filePath)
  context.set('dbName', dbName)
  context.set('dbPath', tempPath)
  context.set('dbClient', new SQLiteClient(tempPath))

  return true
}
