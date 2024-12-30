export interface Service {
  id: string
  deviceId: string
  deviceName: string
}

export interface BatteryLevelService extends Service {
  faults?: any
}

export interface BinarySwitchService extends Service {
  state?: any
}

export interface ShutterContactService extends Service {
  state?: { value: string }
}

export interface TemperatureLevelService extends Service {
  state?: any
}
export interface ValveTappetService extends Service {
  state?: any
}

export interface AirQualityService extends Service {
  state?: { humidity: number; temperature: number; combinedRating: string; purity: number; comfortZone: ComfortZone }
}

export interface ThermostatServices {
  temperatureLevelService: TemperatureLevelService
  valveTappetService: ValveTappetService
  name: string
}

export interface ComfortZone {
  custom?: boolean
  maxHumidity?: number
  maxPurity?: number
  maxTemperature?: number
  minHumidity?: number
  minTemperature?: number
  name?: string
}
