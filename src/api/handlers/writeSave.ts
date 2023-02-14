import { dialog } from "electron"
import path from 'path'
import fsPromises from 'fs/promises'
import context from "../lib/context"

export const writeSave = async (): Promise<boolean> => {
  const saveName = context.get('saveName')
  const savePath = context.get('savePath')
  const dbPath = context.get('dbPath')

  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save file',
    defaultPath: path.join(process.env.LOCALAPPDATA, '/Hogwarts Legacy/Saved/SaveGames/', saveName),
  })

  if (canceled) return false


  const rawSave = await fsPromises.readFile(savePath)
  const rawDb = await fsPromises.readFile(dbPath)

  // Find the start of the SQLite database
  const dbStart = rawSave.indexOf(Buffer.from('SQLite format 3'))

  // Find the size of the SQLite database
  const dbSize = rawDb.byteLength
  const dbSizeBuffer = Buffer.allocUnsafe(4)
  dbSizeBuffer.writeInt32LE(rawDb.byteLength + 4)

  // Inject the SQLite database into the save file
  const fd = await fsPromises.open(filePath, 'w')
  await fd.write(rawSave.subarray(0, dbStart - 30))
  await fd.write(dbSizeBuffer)
  await fd.write(rawSave.subarray(dbStart - 26, dbStart - 4))
  dbSizeBuffer.writeInt32LE(rawDb.byteLength)
  await fd.write(dbSizeBuffer)
  await fd.write(rawDb)
  await fd.write(rawSave.subarray(dbStart + dbSize))
  await fd.close()

  await dialog.showMessageBox({
    title: 'Save file',
    message: 'Save file written successfully',
    type: 'info'
  })

  return true
}
