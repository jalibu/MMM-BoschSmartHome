# MMM-BoschSmartHome (Beta)
A client interface for the Bosch Smart Home System [Magic Mirror](https://magicmirror.builders/).
Click here for the Magic Mirror [Forum Thread](https://forum.magicmirror.builders/topic/14347/mmm-bsh-bosch-smart-home/).
This module is a private and inofficial project without any relation to Robert Bosch Smart Home GmbH. I neither assume liability for damages or give any warranty.


## Features
- Support for multiple rooms
- Shutter Contacts
- Room Climate Controls
- Thermostats
- Twinguards
- Visualization of Temperature, Humidity and Purity
- Bosch Home Connect Dishwashers (experimental!)
- Philips Hue Bridge
- Languages: English, German

## Installing the Module
1) Navigate to the MagicMirror subfolder "modules" and execute the following command
`git clone https://github.com/jalibu/MMM-BoschSmartHome.git`

2) Install dependencies with the following command
`npm i`

3) Generate Certificate
`openssl req -x509 -nodes -days 9999 -newkey rsa:2048 -keyout client-key.pem -out client-cert.pem`

4) Add config entry to MagicMirror/config/config.js
```javascript
{
  module: "MMM-BoschSmartHome",
  position: "top_left",
  config: {
    host: "192.168.0.150", // Bosch Smart Home Bridge's local IP Address
    name: "MMM-BoschSmartHome", // Display name for App
    identifier: "MMM-BoschSmartHome", // Unique Identifier for app
    password: "", // Password for Bosch Smart Home Bridge
    refreshIntervalInSeconds: 60, // Default: 60
    width: "340px",
    displayRoomIcons: false, // Default: false
    displayThermostats: false, // Default: false
    airquality: {
      purity: "bar", // one of [tile, bar, donut, none]. Default: bar
      humidity: "bar", // one of [tile, bar, donut, none]. Default: bar
      temperature: "bar", // one of [tile, bar, donut, none]. Default: bar
      preferredTemperatureProvider: "Twinguard", // Twinguard or ClimateControl. Default: Twinguard, but falls back to CC
      preferredHumidityProvider: "Twinguard" // Twinguard or ClimateControl. Default: Twinguard, but falls back to CC
    }
  }
}
```
5) Important: When the module is started for the first time, a pairing between the MagicMirror and the Bosch Smart Home Bridge is automatically created with the generated certificate. For this to work, you must press the pairing button on the bridge for 5 seconds until it starts flashing. Then startup MagicMirror. This only has to be done once.
