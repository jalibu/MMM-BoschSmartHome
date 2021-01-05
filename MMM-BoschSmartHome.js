"use strict";

Module.register("MMM-BoschSmartHome", {
  result: {},
  defaults: {
    debug: false,
    host: "192.168.0.150",
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

  getBadges(shutterContactDevices, climateControlService) {
    let badges = "";
    let hasOpenContacts = false;
    shutterContactDevices.forEach((shutterContactDevice) => {
      const shutterContactService = shutterContactDevice.services.find(
        (service) => service.id === "ShutterContact"
      );
      hasOpenContacts =
        hasOpenContacts || shutterContactService.state.value !== "CLOSED";
    });
    if (hasOpenContacts) {
      badges +=
        '<span class="bsh-room-badge"><i class="fas fa-wind"></i></span>';
    }
    badges += `<span class="bsh-room-badge"><i class="far ${
      climateControlService.state.operationMode === "MANUAL"
        ? "fa-user-cog"
        : "fa-clock"
    }"></i></span>`;

    return badges;
  },

  getDom() {
    let app = document.createElement("div");
    app.className = "bsh-wrapper";
    let markup = "";
    if (this.err) {
      markup += `<div class="bsh-err"><h3><i class="fas fa-exclamation"></i>Fehler</h3>${this.translate(
        this.err.key
      )}</div>`;
    }

    if (!this.rooms || this.rooms.length < 1) {
      markup += `<div>${this.translate("loading")}</div>`;
    }
    this.rooms.forEach((room) => {
      const climateControlDevice = room.devices.find(
        (device) => device.deviceModel === "ROOM_CLIMATE_CONTROL"
      );

      const shutterContactDevices = room.devices.filter(
        (device) => device.deviceModel === "SWD"
      );

      const climateControlService = climateControlDevice.services.find(
        (service) => service.id === "RoomClimateControl"
      );

      let operationMode;
      if (climateControlService.state.operationMode === "AUTOMATIC") {
        operationMode =
          climateControlService.state.setpointTemperature ===
          climateControlService.state.setpointTemperatureForLevelComfort
            ? "bsh-comfort"
            : "bsh-eco";
      } else {
        operationMode = "bsh-manual";
      }

      let roomMarkup = `<div class='bsh-room-wrapper ${operationMode}'>`;

      roomMarkup += `<div class="bsh-room-title">
			  <span class="bsh-room-icon">
			  <i class="fas ${this.getIcon(room.iconId)}"></i></span>
			  <span class="bsh-room-name">${room.name}</span>
			  <span>${this.getBadges(shutterContactDevices, climateControlService)}</span>
			  </div>`;

      roomMarkup += '<div class="bsh-temperatures">';
      let temperatureLevelDevices = room.devices.filter(
        (device) => device.deviceModel === "TRV"
      );

      temperatureLevelDevices.forEach((temperatureLevelDevice) => {
        const temperatureLevelService = temperatureLevelDevice.services.find(
          (service) => service.id === "TemperatureLevel"
        );
        const valveTappetService = temperatureLevelDevice.services.find(
          (service) => service.id === "ValveTappet"
        );

        let heaterIcon = "";
        if (valveTappetService.state.position > 5) {
          heaterIcon = `<i class="fas fa-thermometer-quarter"></i>`;
        }
        if (valveTappetService.state.position > 15) {
          heaterIcon = `<i class="fas fa-thermometer-three-quarters"></i>`;
        }
        roomMarkup += `<div class="bsh-temperature bsh-temperatures-messured">${temperatureLevelService.state.temperature}°C${heaterIcon}</div>`;
      });

      roomMarkup += `<div class="bsh-temperature bsh-temperatures-target">${climateControlService.state.setpointTemperature}°C</div>`;
      roomMarkup += `</div>`;
      roomMarkup += "</div>";
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
      this.updateDom();
    } else if (notification === "ERROR") {
      this.err = payload;
      this.updateDom();
    }
  }
});
