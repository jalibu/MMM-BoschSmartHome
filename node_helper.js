const NodeHelper = require("node_helper");
const fs = require("fs");
const BSMB = require("bosch-smart-home-bridge");

module.exports = NodeHelper.create({
  start: function () {
    console.log(`${this.name} helper method started...`);
  },
  loadData: async function (config) {
    const self = this;
    let client;
    try {
      const cert = fs.readFileSync(`${__dirname}/client-cert.pem`).toString();
      const key = fs.readFileSync(`${__dirname}/client-key.pem`).toString();

      // Override Logger to avoid fine() logs
      const logger = new BSMB.DefaultLogger();
      logger.fine = () => {};

      const bshb = BSMB.BoschSmartHomeBridgeBuilder.builder()
        .withHost(config.host)
        .withClientCert(cert)
        .withClientPrivateKey(key)
        .withLogger(logger)
        .build();
      client = bshb.getBshcClient();
    } catch (err) {
      console.error(err.message);
      self.sendSocketNotification("ERROR", {
        key: "key_err_cert",
        message: err.message
      });
      return;
    }

    try {
      let rooms = [];
      const {
        parsedResponse: roomsResponse
      } = await client.getRooms().toPromise();

      roomsResponse.forEach((result) => {
        result.devices = [];
        rooms.push(result);
      });
      const { parsedResponse: devices } = await client.getDevices().toPromise();
      devices.forEach((device) => {
        const room = rooms.find((room) => room.id === device.roomId);
        if (room) {
          device.services = [];
          room.devices.push(device);
        }
      });

      const {
        parsedResponse: services
      } = await client.getDevicesServices().toPromise();

      services.forEach((service) => {
        rooms.forEach((room) => {
          const device = room.devices.find(
            (device) => device.id === service.deviceId
          );
          if (device) {
            device.services.push(service);
          }
        });
      });

      self.sendSocketNotification("STATUS_RESULT", rooms);
    } catch (err) {
      console.error(err.message);
      self.sendSocketNotification("ERROR", {
        key: "key_err_loading",
        message: err.message
      });
    }
  },

  socketNotificationReceived: function (notification, config) {
    if (notification === "GET_STATUS") {
      this.loadData(config);
    } else {
      console.warn(`${notification} is invalid notification`);
    }
  }
});
