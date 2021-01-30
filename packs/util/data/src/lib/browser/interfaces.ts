export interface DBConfig {
  name: string
  version: number
  stores: Stores
}

export type Stores = Record<string, Model>

export interface Model {
  deleteOnUpgrade: boolean
  properties: ModelProperties
  indexes: Indexes
}

export interface MemoModel {
  properties: ModelProperties
}

export interface Indexes {
  time: Time
}

export interface Time {
  unique: boolean
}

export interface ModelProperties {
  autoIncrement: boolean
  keyPath: string
}
