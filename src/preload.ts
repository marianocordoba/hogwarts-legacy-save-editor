import { contextBridge, ipcRenderer } from 'electron'

const api = {
  openSave: async () => ipcRenderer.invoke('openSave'),
  writeSave: async () => ipcRenderer.invoke('writeSave'),
  getData: async () => ipcRenderer.invoke('getData'),
  setData: async (data: any) => ipcRenderer.invoke('setData', data),
  importDatabase: async () => ipcRenderer.invoke('importDatabase'),
  exportDatabase: async () => ipcRenderer.invoke('exportDatabase'),
}

export type API = typeof api

contextBridge.exposeInMainWorld('HLSE', api)
