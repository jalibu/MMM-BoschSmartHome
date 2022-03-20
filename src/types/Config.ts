export type Config = {
  airquality: AirqualityConfig
  debug: boolean
  colorizeRoomWithAirQuality: boolean
  displayRoomIcons: boolean
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

type TemperatureLevelConfig = {
  displayCurrentTemperature: boolean
  displayTargetTemperature: boolean
  forceRowTile: boolean
}

type ThermostatsConfig = {
  display: boolean
  displayName: boolean
}

type AirqualityConfig = {
  purity: string
  humidity: string
  temperature: string
  preferredTemperatureProvider: string
  preferredHumidityProvider: string
}
