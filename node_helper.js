var NodeHelper = require("node_helper");
var fs = require("fs");
var BSMB = require("bosch-smart-home-bridge");
const thermostats = [
  {
    name: "Balkon",
    id: "hdm:HomeMaticIP:3014F711A000005BB85C566C",
    room: "Wohnzimmer",
    temperature: null,
    position: null
  },
  {
    name: "Sofa",
    id: "hdm:HomeMaticIP:3014F711A000005BB85C4A2A",
    room: "Wohnzimmer",
    temperature: null,
    position: null
  },
  {
    name: "Bad",
    id: "hdm:HomeMaticIP:3014F711A000005BB85C5977",
    room: "Badezimmer",
    temperature: null,
    position: null
  },
  {
    name: "Arbeitszimmer",
    id: "hdm:HomeMaticIP:3014F711A000005BB85C5680",
    room: "Arbeitszimmer",
    temperature: null,
    position: null
  },
  {
    name: "Schlafzimmer",
    id: "hdm:HomeMaticIP:3014F711A000005BB85C574A",
    room: "Schlafzimmer",
    temperature: null,
    position: null
  }
];
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
            const device = room.devices.find(
              (device) => device.id === servicesResponse.deviceId
            );
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
  }
});
