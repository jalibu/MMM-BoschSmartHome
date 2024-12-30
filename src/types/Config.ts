export interface Config {
  airquality: AirqualityConfig
  debug: boolean
  colorizeRoomWithAirQuality: boolean
  displayRoomIcons: boolean
  hideEmptyRooms: boolean
  hideComponents: any
  host: string
  identifier: string
  mocked: boolean
  name: string
  password: string
  refreshIntervalInSeconds: number
  temperatureLevel: TemperatureLevelConfig
  thermostats: ThermostatsConfig
  roomOrder: string[]
  width: string
}

interface TemperatureLevelConfig {
  displayCurrentTemperature: boolean
  displayTargetTemperature: boolean
  forceRowTile: boolean
}

interface ThermostatsConfig {
  display: boolean
  displayName: boolean
}

interface AirqualityConfig {
  purity: string
  humidity: string
  temperature: string
  preferredTemperatureProvider: string
  preferredHumidityProvider: string
}
