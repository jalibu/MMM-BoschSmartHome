class Utils {
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

  static hasOpenShutters(devices) {
    const shutterContactDevices = devices.filter(
      (device) => device.deviceModel === "SWD"
    );
    let hasOpenShutters = false;
    shutterContactDevices.forEach((shutterContactDevice) => {
      const shutterContactService = shutterContactDevice.services.find(
        (service) => service.id === "ShutterContact"
      );

      hasOpenShutters =
        hasOpenShutters || shutterContactService.state.value !== "CLOSED";
    });

    return hasOpenShutters;
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
}
