"use strict";

Module.register("MMM-BSH", {
  result: {},
  defaults: {
    debug: false,
    host: "192.168.0.150",
    refreshIntervalInSeconds: 60
  },

  getStyles: function () {
    return ["MMM-BSH.css"];
  },

  getTranslations: function () {
    return {
      en: "translations/en.json",
      de: "translations/de.json"
    };
  },

  /*
  getHeader: function () {
    return "Temperaturen";
  },
*/
  start: function () {
    this.rooms = [];
    this.getStatus();
    this.scheduleUpdate();
  },

  getIcon: function (inputIcon) {
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

  getDom: function () {
    let app = document.createElement("div");
    app.className = "bsh-wrapper";
    let markup = "";
    this.rooms.forEach((room) => {
      let roomMarkup = "<div class='bsh-room-wrapper'>";
      let shutterContactDevices = room.devices.filter(
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
      roomMarkup += `<div class="bsh-room-title"><span class="bsh-room-icon"><i class="fas ${this.getIcon(
        room.iconId
      )}"></i></span>${room.name} ${
        hasOpenContacts ? '<i class="fas fa-wind"></i>' : ""
      }</div>`;

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
        console.log(
          "valveTappetService.state.position ",
          valveTappetService.state.position
        );
        roomMarkup += `<div class="bsh-temperature bsh-temperatures-messured">${temperatureLevelService.state.temperature}°C${heaterIcon}</div>`;
      });

      let climateControlDevice = room.devices.find(
        (device) => device.deviceModel === "ROOM_CLIMATE_CONTROL"
      );
      let climateControlService = climateControlDevice.services.find(
        (service) => service.id === "RoomClimateControl"
      );

      roomMarkup += `<div class="bsh-temperature bsh-temperatures-target">${
        climateControlService.state.setpointTemperature
      }°C<i class="fas ${
        climateControlService.state.operationMode === "MANUAL"
          ? "fa-user-cog"
          : "fa-clock"
      }"></i></div>`;
      roomMarkup += `</div>`;
      roomMarkup += "</div>";
      markup += roomMarkup;
    });
    app.innerHTML = markup;
    return app;
  },

  scheduleUpdate: function () {
    const self = this;
    setInterval(function () {
      self.getStatus();
    }, this.config.refreshIntervalInSeconds * 1000);
  },

  getStatus: function () {
    this.sendSocketNotification("GET_STATUS", this.config);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "STATUS_RESULT") {
      this.rooms = payload;
      console.log(this.rooms);
      this.updateDom();
    }
  }
});
