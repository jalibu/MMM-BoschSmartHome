var NodeHelper = require("node_helper");
var fs = require("fs");
var BSMB = require("bosch-smart-home-bridge");

module.exports = NodeHelper.create({
  start: function () {
    console.log(`${this.name} helper method started...`);
  },
  loadData: async function () {
    const self = this;
    const cert = fs.readFileSync(`${__dirname}/client-cert.pem`).toString();
    const key = fs.readFileSync(`${__dirname}/client-key.pem`).toString();

    const bshb = BSMB.BoschSmartHomeBridgeBuilder.builder()
      .withHost("192.168.0.150")
      .withClientCert(cert)
      .withClientPrivateKey(key)
      .build();
    const client = bshb.getBshcClient();

    let rooms = [];
    await client
      .getRooms()
      .toPromise()
      .then(({ parsedResponse }) => {
        parsedResponse.forEach((result) => {
          result.devices = [];
          rooms.push(result);
        });
      });

    await client
      .getDevices()
      .toPromise()
      .then(({ parsedResponse }) => {
        parsedResponse.forEach((deviceResponse) => {
          console.log(deviceResponse);
          const room = rooms.find((room) => room.id === deviceResponse.roomId);
          if (room) {
            deviceResponse.services = [];
            room.devices.push(deviceResponse);
          }
        });
      });

    await client
      .getDevicesServices()
      .toPromise()
      .then(({ parsedResponse }) => {
        parsedResponse.forEach((servicesResponse) => {
          rooms.forEach((room) => {
            const device = room.devices.find((device) => device.id === servicesResponse.deviceId);
            if (device) {
              device.services.push(servicesResponse);
            }
          });
        });
      });

    console.log("ROOMS", JSON.stringify(rooms));

    self.sendSocketNotification("STATUS_RESULT", rooms);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "GET_STATUS") {
      this.loadData(payload);
    } else {
      console.warn(`${notification} is invalid notification`);
    }
  },
});
