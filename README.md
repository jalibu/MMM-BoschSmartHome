# MMM-BoschSmartHome (Beta)
A client interface for the Bosch Smart Home System [Magic Mirror](https://magicmirror.builders/).
Click here for the Magic Mirror [Forum Thread](https://forum.magicmirror.builders/topic/14347/mmm-bsh-bosch-smart-home/)


## Features
- tbd

## Installing the Module
Navigate to the MagicMirror subfolder "modules" and execute the following command
`git clone https://github.com/jalibu/MMM-BoschSmartHome.git`

Install dependencies with the following command
`npm i`

Generate Certificate
`openssl req -x509 -nodes -days 9999 -newkey rsa:2048 -keyout client-key.pem -out client-cert.pem`

Add config entry to MagicMirror/config/config.js

### Sample config.js entry
```javascript
{
	module: "MMM-BSH",
	position: "top_left",
	config: {
    host: "192.168.0.150", // Local IP Address
    name: "MMM-BoschSmartHome", // Display name for App
    identifier: "MMM-BoschSmartHome", // Unique Identifier for app
    password: "",
    refreshIntervalInSeconds: 60
	}
}
```
