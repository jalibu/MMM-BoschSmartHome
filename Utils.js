/* global Class */

const Utils = Class.extend({
  transformRoomIcons(rooms) {
    rooms.forEach((room) => {
      switch (room.iconId) {
        case "icon_room_bathroom":
          room.iconId = "fa-bath";
          break;
        case "icon_room_bedroom":
          room.iconId = "fa-bed";
          break;
        case "icon_room_office":
          room.iconId = "fa-briefcase";
          break;
        case "icon_room_living_room":
          room.iconId = "fa-couch";
          break;
        default:
          room.iconId = "fa-house-user";
          break;
      }
    });
    return rooms;
  },

  getShutterContactBadge(devices) {
    const shutterContactDevices = devices.filter(
      (device) => device.deviceModel === "SWD"
    );
    let hasOpenContacts = false;
    shutterContactDevices.forEach((shutterContactDevice) => {
      const shutterContactService = shutterContactDevice.services.find(
        (service) => service.id === "ShutterContact"
      );
      hasOpenContacts =
        hasOpenContacts || shutterContactService.state.value !== "CLOSED";
    });
    if (hasOpenContacts) {
      return '<span class="bsh-room-badge"><i class="fas fa-wind"></i></span>';
    }

    return "";
  },

  getTwingardTile(devices) {
    const twinguardDevice = devices.find(
      (device) => device.deviceModel === "TWINGUARD"
    );
    if (!twinguardDevice) return "";

    const airQualityLevelService = twinguardDevice.services.find(
      (service) => service.id === "AirQualityLevel"
    );

    return `
		  	<div class="bsh-tile airquality ${airQualityLevelService.state.purityRating}">
			  <i class="fas fa-lungs"></i>${airQualityLevelService.state.purity}ppm
			</div>
			<div class="bsh-tile airquality ${airQualityLevelService.state.temperatureRating}">
			  <i class="fas fa-thermometer"></i>${airQualityLevelService.state.temperature}°C
			</div>
			<div class="bsh-tile airquality ${airQualityLevelService.state.humidityRating}">
			  <i class="fas fa-tint"></i>${airQualityLevelService.state.humidity}%
			</div>`;
  },

  getClimateControlTile(devices) {
    const climateControlDevice = devices.find(
      (device) => device.deviceModel === "ROOM_CLIMATE_CONTROL"
    );
    if (!climateControlDevice) return "";

    const climateControlService = climateControlDevice.services.find(
      (service) => service.id === "RoomClimateControl"
    );
    if (!climateControlService) return "";

    let operationMode;
    if (climateControlService.state.operationMode === "AUTOMATIC") {
      if (
        climateControlService.state.setpointTemperature ===
        climateControlService.state.setpointTemperatureForLevelComfort
      ) {
        operationMode = "bsh-comfort";
      } else if (
        climateControlService.state.setpointTemperature ===
        climateControlService.state.setpointTemperatureForLevelEco
      ) {
        operationMode = "bsh-eco";
      } else {
        operationMode = "bsh-manual";
      }
    } else {
      operationMode = "bsh-manual";
    }

    return `<div class="bsh-tile climate-control ${operationMode}"><i class="${
      climateControlService.state.operationMode === "MANUAL"
        ? "fas fa-user-cog"
        : "far fa-clock"
    }"></i>${climateControlService.state.setpointTemperature}°C</div>`;
  },

  getTemperatureLevelTiles(devices) {
    let markup = "";
    let temperatureLevelDevices = devices.filter(
      (device) => device.deviceModel === "TRV"
    );

    temperatureLevelDevices.forEach((temperatureLevelDevice) => {
      const temperatureLevelService = temperatureLevelDevice.services.find(
        (service) => service.id === "TemperatureLevel"
      );

      let icon = "";
      const valveTappetService = temperatureLevelDevice.services.find(
        (service) => service.id === "ValveTappet"
      );
      if (valveTappetService) {
        if (valveTappetService.state.position > 30) {
          icon = `<i class="fas fa-thermometer-full"></i>`;
        } else if (valveTappetService.state.position > 20) {
          icon = `<i class="fas fa-thermometer-three-quarters"></i>`;
        } else if (valveTappetService.state.position > 10) {
          icon = `<i class="fas fa-thermometer-half"></i>`;
        } else if (valveTappetService.state.position > 5) {
          icon = `<i class="fas fa-thermometer-quarter"></i>`;
        } else {
          icon = `<i class="fas fa-thermometer-empty"></i>`;
        }
      } else {
        icon = `<i class="fas fa-thermometer"></i>`;
      }

      markup += `<div class="bsh-tile temperature-level">${icon}${temperatureLevelService.state.temperature}°C</div>`;
    });

    return markup;
  }
});
