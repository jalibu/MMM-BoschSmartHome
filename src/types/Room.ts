import { Device } from './Device'

export type Room = {
  id: string
  name: string
  iconId: string
  devices: Device[]
}
