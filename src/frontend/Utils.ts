import { Device, ShutterContactDevice } from '../types/Device'
import { Config } from '../types/Config'
import { Room } from '../types/Room'

import {
  BatteryLevelService,
  BinarySwitchService,
  ShutterContactService,
  TemperatureLevelService,
  AirQualityService,
  ValveTappetService,
  ComfortZone,
  Service,
  ThermostatServices
} from '../types/Service'

export default class BSHUtils {
  static getRoomIcon(iconId: string): string {
    switch (iconId) {
      case 'icon_room_bathroom':
        return 'fa-bath'
      case 'icon_room_bedroom':
        return 'fa-bed'
      case 'icon_room_office':
        return 'fa-briefcase'
      case 'icon_room_living_room':
        return 'fa-couch'
      case 'icon_room_dining_room':
        return 'fa-utensils'
      default:
        return 'fa-house-user'
    }
  }

  static getLowBatteryDevices(devices: Device[]): Device[] {
    const response = []

    for (const device of devices) {
      const batteryLevelService: BatteryLevelService = device.services.find((service) => service.id === 'BatteryLevel')

      if (batteryLevelService && batteryLevelService.faults) {
        response.push(device.name)
      }
    }

    return response
  }

  static getSwitchedOnHueDevices(devices: Device[]): string[] {
    const hueLights = devices.filter((device) => device.deviceModel === 'HUE_LIGHT')
    const switchedOnDevices: string[] = []
    hueLights.forEach((hueLight) => {
      const binarySwitchService: BinarySwitchService = hueLight.services.find(
        (service) => service.id === 'BinarySwitch'
      )
      if (binarySwitchService.state.on && switchedOnDevices.indexOf(hueLight.name) <= 0) {
        switchedOnDevices.push(hueLight.name)
      }
    })

    return switchedOnDevices
  }

  static getOpenShutters(devices: Device[]): string[] {
    const shutterContactDevices: ShutterContactDevice[] = devices.filter((device) => device.deviceModel === 'SWD')
    const openShutters: string[] = []
    shutterContactDevices.forEach((shutterContactDevice) => {
      const shutterContactService: ShutterContactService = shutterContactDevice.services.find(
        (service) => service.id === 'ShutterContact'
      )
      if (shutterContactService.state.value !== 'CLOSED' && openShutters.indexOf(shutterContactDevice.profile) <= 0) {
        openShutters.push(shutterContactDevice.profile)
      }
    })

    return openShutters
  }

  static getClimateControlService(devices: Device[]): Service {
    const climateControlDevice = devices.find((device) => device.deviceModel === 'ROOM_CLIMATE_CONTROL')
    if (!climateControlDevice) return null

    return climateControlDevice.services.find((service) => service.id === 'RoomClimateControl')
  }

  static getTemperatureLevelService(devices: Device[]): Service {
    const climateControlDevice = devices.find((device) => device.deviceModel === 'ROOM_CLIMATE_CONTROL')
    if (!climateControlDevice) return null

    return climateControlDevice.services.find((service) => service.id === 'TemperatureLevel')
  }

  static getAirQualityService(devices: Device[]): Service {
    const twinguardDevice = devices.find((device) => device.deviceModel === 'TWINGUARD')
    if (!twinguardDevice) return null

    return twinguardDevice.services.find((service) => service.id === 'AirQualityLevel')
  }

  static getThermostatServices(devices: Device[]): ThermostatServices[] {
    const temperatureLevelDevices = devices.filter((device) => device.deviceModel === 'TRV')

    if (!temperatureLevelDevices) return null

    const services: {
      temperatureLevelService: TemperatureLevelService
      valveTappetService: ValveTappetService
      name: string
    }[] = []

    temperatureLevelDevices.forEach((temperatureLevelDevice) => {
      const temperatureLevelService: TemperatureLevelService = temperatureLevelDevice.services.find(
        (service) => service.id === 'TemperatureLevel'
      )

      const valveTappetService = temperatureLevelDevice.services.find((service) => service.id === 'ValveTappet')
      services.push({
        temperatureLevelService,
        valveTappetService,
        name: temperatureLevelDevice.name
      })
    })

    return services
  }

  static getDishWasherService(devices: Device[]): Service {
    const dishwasherDevice = devices.find((device) => device.deviceModel === 'HOMECONNECT_DISHWASHER')

    if (!dishwasherDevice) return null

    const service = dishwasherDevice.services.find((deviceService) => deviceService.id === 'HCDishwasher')

    service.deviceName = dishwasherDevice.name

    return service
  }

  static getChartHumidityPercentage(humidity: number): number {
    return humidity > 100 ? 100 : humidity
  }

  static getChartPurityPercentage(airQualityService: AirQualityService): number {
    const result = (airQualityService.state.purity / airQualityService.state.comfortZone.maxPurity) * 50

    return result > 100 ? 100 : result
  }

  static getChartTemperaturePercentage(temperature: number, profile: ComfortZone): number {
    if (!profile || !temperature) return null

    const perfectTemp = profile.maxTemperature - (profile.maxTemperature - profile.minTemperature)
    const result = (temperature / perfectTemp) * 50

    return result > 100 ? 100 : result
  }

  static isHidden(room: Room, componentType: string, config: Config): boolean {
    return config.hideComponents[room.name] && config.hideComponents[room.name].indexOf(componentType) >= 0
  }
}
