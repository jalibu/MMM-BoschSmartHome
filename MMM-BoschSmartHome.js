"use strict";

Module.register("MMM-BoschSmartHome", {
  result: {},
  defaults: {
    debug: false,
    host: "192.168.0.150",
    name: "MMM-BoschSmartHome",
    identifier: "MMM-BoschSmartHome",
    password: "",
    refreshIntervalInSeconds: 60
  },

  getStyles() {
    return ["MMM-BoschSmartHome.css"];
  },

  getTranslations() {
    return {
      en: "translations/en.json",
      de: "translations/de.json"
    };
  },

  getHeader() {
    // return "Temperaturen";
  },

  start() {
    this.rooms = [];
    this.err = null;
    this.getStatus();
    this.scheduleUpdate();
    this.updateDom();
  },

  getIcon(inputIcon) {
    switch (inputIcon) {
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
  },

  getDom() {
    const app = document.createElement("div");
    app.className = "bsh-wrapper";
    let markup = "";
    if (this.err) {
      markup += `<div class="bsh-err"><h3><i class="fas fa-exclamation"></i>Fehler</h3>${this.translate(
        this.err.key
      )}</div>`;
    }

    if ((!this.rooms || this.rooms.length < 1) && !this.err) {
      markup += `<div>${this.translate("loading")}</div>`;
    }

    this.rooms.forEach((room) => {
      let roomMarkup = `
		<div class='bsh-room-wrapper'>
	  		<div class="bsh-room-title">
			  <span class="bsh-room-icon">
			  <i class="fas ${this.getIcon(room.iconId)}"></i></span>
			  <span class="bsh-room-name">${room.name}</span>
			  <span class="bsh-badges">${this.getShutterContactBadge(room.devices)}</span>
			</div>
			<div class="bsh-tiles">
				${this.getClimateControlTile(room.devices)}
				${this.getTwingardTile(room.devices)}
				${this.getTemperatureLevelTiles(room.devices)}
			</div>
		</div>`;

      markup += roomMarkup;
    });
    app.innerHTML = markup;

    return app;
  },

  scheduleUpdate() {
    const self = this;
    setInterval(function () {
      self.getStatus();
    }, this.config.refreshIntervalInSeconds * 1000);
  },

  getStatus() {
    this.sendSocketNotification("GET_STATUS", this.config);
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "STATUS_RESULT") {
      this.err = null;
      this.rooms = payload;
      console.log(this.rooms);
      this.updateDom();
    } else if (notification === "ERROR") {
      this.err = payload;
      this.updateDom();
    }
  }
});
