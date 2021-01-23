import Utils from "./Utils";
import { Config } from "../models/Config";

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
      purity: "bar", // one of [tile, bar, donut, none]
      humidity: "bar", // one of [tile, bar, donut, none]
      temperature: "bar", // one of [tile, bar, donut, none]
      preferredTemperatureProvider: "Twinguard", // Twinguard or ClimateControl
      preferredHumidityProvider: "Twinguard" // Twinguard or ClimateControl
    }
  } as Config,

  getStyles() {
    return ["font-awesome.css", "MMM-BoschSmartHome.css"];
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
      utils: Utils
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

  socketNotificationReceived(notificationIdentifier: string, payload: any) {
    if (notificationIdentifier === "STATUS_RESULT") {
      this.error = null;
      this.rooms = payload;
      this.updateDom();
      console.log(this.rooms);
    } else if (notificationIdentifier === "ERROR") {
      this.error = payload;
      this.updateDom();
    }
  }
});
