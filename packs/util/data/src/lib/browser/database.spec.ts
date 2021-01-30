import { Database } from './database'

describe('Database', () => {
  let db: Database

  beforeEach(() => {
    db = new Database({
      name: 'test',
      stores: {
        store: {
          indexes: {
            time: {
              unique: true,
            },
          },
          properties: {
            autoIncrement: true,
            keyPath: '',
          },
          deleteOnUpgrade: true,
        },
      },
      version: 1,
    })
  })

  it('should create an instance', () => {
    expect(db).toBeTruthy()
    expect(db).toBeInstanceOf(Database)
  })

  it('should deleteOnUpgrade is true', () => {
    expect(db.getStore('store').deleteOnUpgrade).toBeTruthy()
  })

  it('should stores was defined', () => {
    expect(db.stores).toBeDefined()
  })

  it('should version is equal 1', () => {
    expect(db.version).toEqual(1)
  })
})
