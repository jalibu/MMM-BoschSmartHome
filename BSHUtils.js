class BSHUtils {
  static getRoomIcon(iconId) {
    switch (iconId) {
      case "icon_room_bathroom":
        return "fa-bath";
      case "icon_room_bedroom":
        return "fa-bed";
      case "icon_room_office":
        return "fa-briefcase";
      case "icon_room_living_room":
        return "fa-couch";
      default:
        return "fa-house-user";
    }
  }

  static getLowBatteryDevices(devices) {
    const response = [];

    for (const device of devices) {
      const batteryLevelService = device.services.find(
        (service) => service.id === "BatteryLevel"
      );

      if (batteryLevelService && batteryLevelService.faults) {
        response.push(device.name);
      }
    }
    return response;
  }

  static getSwitchedOnHueDevices(devices) {
    const hueLights = devices.filter(
      (device) => device.deviceModel === "HUE_LIGHT"
    );
    let switchedOnDevices = [];
    hueLights.forEach((hueLight) => {
      const binarySwitchService = hueLight.services.find(
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

  static getOpenShutters(devices) {
    const shutterContactDevices = devices.filter(
      (device) => device.deviceModel === "SWD"
    );
    let openShutters = [];
    shutterContactDevices.forEach((shutterContactDevice) => {
      const shutterContactService = shutterContactDevice.services.find(
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

  static getClimateControlService(devices) {
    const climateControlDevice = devices.find(
      (device) => device.deviceModel === "ROOM_CLIMATE_CONTROL"
    );
    if (!climateControlDevice) return;

    return climateControlDevice.services.find(
      (service) => service.id === "RoomClimateControl"
    );
  }

  static getTemperatureLevelService(devices) {
    const climateControlDevice = devices.find(
      (device) => device.deviceModel === "ROOM_CLIMATE_CONTROL"
    );
    if (!climateControlDevice) return;

    return climateControlDevice.services.find(
      (service) => service.id === "TemperatureLevel"
    );
  }

  static getAirQualityService(devices) {
    const twinguardDevice = devices.find(
      (device) => device.deviceModel === "TWINGUARD"
    );
    if (!twinguardDevice) return "";

    return twinguardDevice.services.find(
      (service) => service.id === "AirQualityLevel"
    );
  }

  static getThermostatServices(devices) {
    let temperatureLevelDevices = devices.filter(
      (device) => device.deviceModel === "TRV"
    );

    if (!temperatureLevelDevices) return;

    const services = [];

    temperatureLevelDevices.forEach((temperatureLevelDevice) => {
      const temperatureLevelService = temperatureLevelDevice.services.find(
        (service) => service.id === "TemperatureLevel"
      );

      const valveTappetService = temperatureLevelDevice.services.find(
        (service) => service.id === "ValveTappet"
      );
      services.push({ temperatureLevelService, valveTappetService });
    });

    return services;
  }

  static getDishWasherService(devices) {
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
}
