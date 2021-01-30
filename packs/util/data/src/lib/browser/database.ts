import { WithTarget } from '@peek/core/model'
import { DBConfig, Stores } from './interfaces'

export class Database implements DBConfig {
  db: IDBDatabase
  name: string
  version: number
  stores: Stores

  constructor(readonly config: DBConfig) {
    this.db = null
    this.name = config.name
    this.version = config.version
    this.stores = config.stores
  }

  getStore(name: string) {
    if (!this.stores[name]) {
      throw `No store with name ${name}`
    }
    return this.stores[name]
  }

  open() {
    if (this.db) return Promise.resolve(this.db)

    return new Promise((resolve, reject) => {
      const dbOpen = indexedDB.open(this.name, this.version)

      dbOpen.onupgradeneeded = (e) => {
        this.db = (e.target as IDBRequest).result

        const storeNames = Object.keys(this.stores)
        let storeName: string

        for (let s = 0; s < storeNames.length; s++) {
          storeName = storeNames[s]

          // If the store already exists
          if (this.db.objectStoreNames.contains(storeName)) {
            // Check to see if the store should be deleted.
            // If so delete, and if not skip to the next store.
            if (this.stores[storeName].deleteOnUpgrade)
              this.db.deleteObjectStore(storeName)
            else continue
          }

          const dbStore = this.db.createObjectStore(
            storeName,
            this.stores[storeName].properties
          )

          if (typeof this.stores[storeName].indexes !== 'undefined') {
            const indexes = this.stores[storeName].indexes
            const indexNames = Object.keys(indexes)
            let index: string

            for (var i = 0; i < indexNames.length; i++) {
              index = indexNames[i]
              dbStore.createIndex(index, index, indexes[index])
            }
          }
        }
      }

      dbOpen.onsuccess = (e) => {
        this.db = (e.target as any).result
        resolve(this.db)
      }

      dbOpen.onerror = (e) => reject(e)
    })
  }

  close() {
    return new Promise((resolve, reject) => {
      if (!this.db) reject('No database connection')

      this.db.close()
      resolve(this.db)
    })
  }

  nuke() {
    return new Promise((resolve, reject) => {
      console.log('Nuking... ' + this.name)

      this.close()

      const dbTransaction = indexedDB.deleteDatabase(this.name)
      dbTransaction.onsuccess = (e) => {
        console.log('Nuked...')
        resolve(e)
      }

      dbTransaction.onerror = (e) => {
        reject(e)
      }
    })
  }

  async put(name: string, value: any, key: string) {
    return this.open().then((db: IDBDatabase) => {
      return new Promise((resolve, reject) => {
        const dbTransaction = db.transaction(name, 'readwrite')
        const dbStore = dbTransaction.objectStore(name)
        const dbRequest = dbStore.put(value, key)

        dbTransaction.oncomplete = (e) => resolve(dbRequest.result)

        dbTransaction.onabort = dbTransaction.onerror = (e) => reject(e)
      })
    })
  }

  async get(name: string, value: any) {
    return this.open().then((db: IDBDatabase) => {
      return new Promise((resolve, reject) => {
        const dbTransaction = db.transaction(name, 'readonly')
        const dbStore = dbTransaction.objectStore(name)
        let dbStoreRequest

        dbTransaction.oncomplete = (e) => resolve(dbStoreRequest.result)

        dbTransaction.onabort = dbTransaction.onerror = (e) => reject(e)

        dbStoreRequest = dbStore.get(value)
      })
    })
  }

  async getAll(name: string, index: number, order: IDBCursorDirection) {
    return this.open().then((db: IDBDatabase) => {
      return new Promise((resolve, reject) => {
        const dbTransaction = db.transaction(name, 'readonly')
        const dbStore = dbTransaction.objectStore(name)
        let dbCursor: IDBRequest

        if (typeof order !== 'string') order = 'next'

        if (typeof index === 'string')
          dbCursor = dbStore.index(index).openCursor(null, order)
        else dbCursor = dbStore.openCursor()

        const dbResults = []

        dbCursor.onsuccess = (e: WithTarget<IDBRequest>) => {
          const cursor = e.target.result

          if (cursor) {
            dbResults.push({
              key: cursor.key,
              value: cursor.value,
            })
            cursor.continue()
          } else {
            resolve(dbResults)
          }
        }

        dbCursor.onerror = (e) => reject(e)
      })
    })
  }

  async delete(name: string, key: string) {
    return this.open().then((db: IDBDatabase) => {
      return new Promise((resolve, reject) => {
        const dbTransaction = db.transaction(name, 'readwrite')
        const dbStore = dbTransaction.objectStore(name)

        dbTransaction.oncomplete = (e) => resolve(e)

        dbTransaction.onabort = dbTransaction.onerror = (e) => reject(e)

        dbStore.delete(key)
      })
    })
  }

  async deleteAll(name: string) {
    return this.open().then((db: IDBDatabase) => {
      return new Promise((resolve, reject) => {
        const dbTransaction = db.transaction(name, 'readwrite')
        const dbStore = dbTransaction.objectStore(name)
        const dbRequest = dbStore.clear()

        dbRequest.onsuccess = (e) => resolve(e)
        dbRequest.onerror = (e) => reject(e)
      })
    })
  }
}
