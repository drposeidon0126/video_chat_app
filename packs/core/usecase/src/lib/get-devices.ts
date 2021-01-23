import { UseCase } from './usecase'

export class GetDevices implements UseCase<MediaDeviceKind, MediaDeviceInfo[]> {
  async execute(params: MediaDeviceKind): Promise<MediaDeviceInfo[]> {
    const filter = ({ kind }: MediaDeviceInfo) => kind === params
    const devices = await navigator.mediaDevices.enumerateDevices()
    return params ? devices.filter(filter) : devices
  }
}
