import { Service } from './Service'

export interface Device {
  id: string
  roomId: string
  services: Service[]
  deviceModel: string
  name: string
}

export interface ShutterContactDevice extends Device {
  profile?: any
}
