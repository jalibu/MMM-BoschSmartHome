"use strict";

Module.register("MMM-BoschSmartHome", {
  defaults: {
    debug: false,
    header: "Bosch",
    host: "192.168.0.150",
    name: "MMM-BoschSmartHome",
    identifier: "MMM-BoschSmartHome",
    password: "",
    refreshIntervalInSeconds: 60
  },

  getStyles() {
    return ["MMM-BoschSmartHome.css"];
  },

  getScripts() {
    return ["Utils.js"];
  },

  getTranslations() {
    return {
      en: "translations/en.json",
      de: "translations/de.json"
    };
  },

  getTemplate() {
    return "templates/MMM-BoschSmartHome.njk";
  },

  getTemplateData() {
    return {
      config: this.config,
      rooms: this.rooms,
      error: this.error,
      utils: { getIcon: this.getIcon }
    };
  },

  getHeader() {
    return this.config.header;
  },

  start() {
    this.rooms = [];
    this.error = null;
    this.loadData();
    this.scheduleUpdate();
    this.updateDom();
  },

  /*
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
  */

  scheduleUpdate() {
    const self = this;
    setInterval(() => {
      self.loadData();
    }, this.config.refreshIntervalInSeconds * 1000);
  },

  loadData() {
    this.sendSocketNotification("GET_STATUS", this.config);
  },

  transformResponse(rooms) {
    console.log("this", this);
    rooms = this.transformRoomIcons(rooms);
    console.log("Rooms", rooms);
    return rooms;
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "STATUS_RESULT") {
      this.error = null;
      this.rooms = this.transformResponse(payload);
      this.updateDom();
    } else if (notification === "ERROR") {
      this.error = payload;
      this.updateDom();
    }
  }
});
