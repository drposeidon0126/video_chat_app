import { UseCase } from './usecase'

export type PermissionQueryOptions =
  | PermissionDescriptor
  | DevicePermissionDescriptor
  | MidiPermissionDescriptor
  | PushPermissionDescriptor

export class RequestPermission
  implements UseCase<PermissionQueryOptions, PermissionStatus> {
  execute(queryOptions?: PermissionQueryOptions): Promise<PermissionStatus> {
    return navigator.permissions.query(queryOptions)
  }
}
