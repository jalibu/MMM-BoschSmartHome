import { Device } from './Device'

export interface Room {
  id: string
  name: string
  iconId: string
  devices: Device[]
}
