/* global Class, BSHUtils */
"use strict";

Module.register("MMM-BoschSmartHome", {
  defaults: {
    mocked: false,
    debug: false,
    header: null,
    host: "192.168.0.150",
    name: "MMM-BoschSmartHome",
    identifier: "MMM-BoschSmartHome",
    password: "",
    width: "340px",
    refreshIntervalInSeconds: 60,
    displayRoomIcons: false,
    displayThermostats: false,
    airquality: {
      purity: "bar",
      humidity: "bar",
      temperature: "bar",
      preferredTemperatureProvider: "Twinguard",
      preferredHumidityProvider: "Twinguard"
    }
  },

  getStyles() {
    return ["font-awesome.css", "MMM-BoschSmartHome.css", "Charts.css"];
  },

  getScripts() {
    return [this.file("BSHUtils.js")];
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
      utils: BSHUtils
    };
  },

  getHeader() {
    return this.config.header;
  },

  start() {
    // Override defaults
    this.nunjucksEnvironment().loaders[0].async = false;
    this.nunjucksEnvironment().loaders[0].useCache = true;

    this.rooms = [];
    this.error = null;
    this.loadData();
    this.scheduleUpdate();
    this.updateDom();
  },

  scheduleUpdate() {
    const self = this;
    setInterval(() => {
      self.loadData();
    }, this.config.refreshIntervalInSeconds * 1000);
  },

  loadData() {
    this.sendSocketNotification("GET_STATUS", this.config);
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "STATUS_RESULT") {
      this.error = null;
      this.rooms = payload;
      console.log(this.rooms);
      this.updateDom();
    } else if (notification === "ERROR") {
      this.error = payload;
      this.updateDom();
    }
  }
});
