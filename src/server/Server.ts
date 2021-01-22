import * as NodeHelper from "node_helper";
import { Config } from "../models/Config";
import { Device } from "../models/Device";
import { Service } from "../models/Service";
const fs = require("fs");
const BSMB = require("bosch-smart-home-bridge");

module.exports = NodeHelper.create({
  cert: null,
  key: null,
  logger: null,
  client: null,
  rooms: null,
  start() {
    this.cert = fs.readFileSync(`${__dirname}/client-cert.pem`).toString();
    this.key = fs.readFileSync(`${__dirname}/client-key.pem`).toString();

    // Override Logger to avoid some annoying logs
    this.logger = new BSMB.DefaultLogger();
    this.logger.fine = () => {};
    this.logger.info = (msg: string) => {
      if (
        msg.indexOf("Using existing certificate") >= 0 ||
        msg.indexOf("Check if client with identifier") >= 0
      ) {
        return;
      }
      console.info(msg);
    };

    console.log(`${this.name} helper method started...`);
  },

  async establishConnection(config: Config) {
    if (!this.client) {
      try {
        const bshb = BSMB.BoschSmartHomeBridgeBuilder.builder()
          .withHost(config.host)
          .withClientCert(this.cert)
          .withClientPrivateKey(this.key)
          .withLogger(this.logger)
          .build();

        await bshb
          .pairIfNeeded(config.name, config.identifier, config.password)
          .toPromise();
        this.client = bshb.getBshcClient();
      } catch (err) {
        console.log(err);
      }
    }
  },

  async loadData() {
    try {
      if (!this.rooms) {
        const {
          parsedResponse: rooms
        } = await this.client.getRooms().toPromise();
        this.rooms = rooms;
      }

      const {
        parsedResponse: devices
      }: {
        parsedResponse: Device[];
      } = await this.client.getDevices().toPromise();

      const {
        parsedResponse: services
      }: {
        parsedResponse: Service[];
      } = await this.client.getDevicesServices().toPromise();

      for (const device of devices) {
        device.services = services.filter(
          (service) => service.deviceId === device.id
        );
      }

      for (const room of this.rooms) {
        room.devices = devices.filter((device) => device.roomId === room.id);
      }
    } catch (err) {
      console.error(err.message);
    }
  },

  async socketNotificationReceived(notification, config) {
    if (notification === "GET_STATUS") {
      if (config.mocked) {
        const data = fs.readFileSync(__dirname + "/debugResponse.json");
        this.rooms = JSON.parse(data);
      } else {
        await this.establishConnection(config);
        await this.loadData();

        if (config.debug) {
          fs.writeFileSync(
            __dirname + "/debugResponse.json",
            JSON.stringify(this.rooms)
          );
        }
      }
      this.sendSocketNotification("STATUS_RESULT", this.rooms);
    } else {
      console.warn(`${notification} is invalid notification`);
    }
  }
});
