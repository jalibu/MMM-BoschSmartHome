import { Device, ShutterContactDevice } from "../models/Device";
import { Config } from "../models/Config";
import { Room } from "../models/Room";
import {
  BatteryLevelService,
  BinarySwitchService,
  ShutterContactService,
  TemperatureLevelService,
  AirQualityService,
  ValveTappetService,
  ComfortZone
} from "../models/Service";

export default class BSHUtils {
  static getRoomIcon(iconId: string) {
    switch (iconId) {
      case "icon_room_bathroom":
        return "fa-bath";
      case "icon_room_bedroom":
        return "fa-bed";
      case "icon_room_office":
        return "fa-briefcase";
      case "icon_room_living_room":
        return "fa-couch";
      case "icon_room_dining_room":
        return "fa-utensils";
      default:
        return "fa-house-user";
    }
  }

  static getLowBatteryDevices(devices: Device[]) {
    const response = [];

    for (const device of devices) {
      const batteryLevelService: BatteryLevelService = device.services.find(
        (service) => service.id === "BatteryLevel"
      );

      if (batteryLevelService && batteryLevelService.faults) {
        response.push(device.name);
      }
    }
    return response;
  }

  static getSwitchedOnHueDevices(devices: Device[]) {
    const hueLights = devices.filter(
      (device) => device.deviceModel === "HUE_LIGHT"
    );
    let switchedOnDevices: string[] = [];
    hueLights.forEach((hueLight) => {
      const binarySwitchService: BinarySwitchService = hueLight.services.find(
        (service) => service.id === "BinarySwitch"
      );
      if (
        binarySwitchService.state.on &&
        switchedOnDevices.indexOf(hueLight.name) <= 0
      ) {
        switchedOnDevices.push(hueLight.name);
      }
    });
    return switchedOnDevices;
  }

  static getOpenShutters(devices: Device[]) {
    const shutterContactDevices: ShutterContactDevice[] = devices.filter(
      (device) => device.deviceModel === "SWD"
    );
    let openShutters: string[] = [];
    shutterContactDevices.forEach((shutterContactDevice) => {
      const shutterContactService: ShutterContactService = shutterContactDevice.services.find(
        (service) => service.id === "ShutterContact"
      );
      if (
        shutterContactService.state.value !== "CLOSED" &&
        openShutters.indexOf(shutterContactDevice.profile) <= 0
      ) {
        openShutters.push(shutterContactDevice.profile);
      }
    });

    return openShutters;
  }

  static getClimateControlService(devices: Device[]) {
    const climateControlDevice = devices.find(
      (device) => device.deviceModel === "ROOM_CLIMATE_CONTROL"
    );
    if (!climateControlDevice) return;

    return climateControlDevice.services.find(
      (service) => service.id === "RoomClimateControl"
    );
  }

  static getTemperatureLevelService(devices: Device[]) {
    const climateControlDevice = devices.find(
      (device) => device.deviceModel === "ROOM_CLIMATE_CONTROL"
    );
    if (!climateControlDevice) return;

    return climateControlDevice.services.find(
      (service) => service.id === "TemperatureLevel"
    );
  }

  static getAirQualityService(devices: Device[]) {
    const twinguardDevice = devices.find(
      (device) => device.deviceModel === "TWINGUARD"
    );
    if (!twinguardDevice) return "";

    return twinguardDevice.services.find(
      (service) => service.id === "AirQualityLevel"
    );
  }

  static getThermostatServices(devices: Device[]) {
    let temperatureLevelDevices = devices.filter(
      (device) => device.deviceModel === "TRV"
    );

    if (!temperatureLevelDevices) return;

    const services: {
      temperatureLevelService: TemperatureLevelService;
      valveTappetService: ValveTappetService;
      name: string;
    }[] = [];

    temperatureLevelDevices.forEach((temperatureLevelDevice) => {
      const temperatureLevelService: TemperatureLevelService = temperatureLevelDevice.services.find(
        (service) => service.id === "TemperatureLevel"
      );

      const valveTappetService = temperatureLevelDevice.services.find(
        (service) => service.id === "ValveTappet"
      );
      services.push({
        temperatureLevelService,
        valveTappetService,
        name: temperatureLevelDevice.name
      });
    });
    console.log(services);
    return services;
  }

  static getDishWasherService(devices: Device[]) {
    let dishwasherDevice = devices.find(
      (device) => device.deviceModel === "HOMECONNECT_DISHWASHER"
    );

    if (!dishwasherDevice) return;

    const service = dishwasherDevice.services.find(
      (service) => service.id === "HCDishwasher"
    );

    service.deviceName = dishwasherDevice.name;

    return service;
  }

  static getChartHumidityPercentage(humidity: number) {
    return humidity > 100 ? 100 : humidity;
  }

  static getChartPurityPercentage(airQualityService: AirQualityService) {
    const result =
      (airQualityService.state.purity /
        airQualityService.state.comfortZone.maxPurity) *
      50;

    return result > 100 ? 100 : result;
  }

  static getChartTemperaturePercentage(
    temperature: number,
    profile: ComfortZone
  ) {
    if (!profile || !temperature) return null;

    const perfectTemp =
      profile.maxTemperature -
      (profile.maxTemperature - profile.minTemperature);
    const result = (temperature / perfectTemp) * 50;

    return result > 100 ? 100 : result;
  }

  static isHidden(room: Room, componentType: string, config: Config): boolean {
    return (
      config.hideComponents[room.name] &&
      config.hideComponents[room.name].indexOf(componentType) >= 0
    );
  }
}
