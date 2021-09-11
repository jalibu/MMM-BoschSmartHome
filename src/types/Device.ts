import { Service } from './Service'
export type Device = {
  id: string
  roomId: string
  services: Service[]
  deviceModel: string
  name: string
}

export interface ShutterContactDevice extends Device {
  profile?: any
}
