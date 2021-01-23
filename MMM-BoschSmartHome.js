/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/Client.ts":
/*!******************************!*\
  !*** ./src/client/Client.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Utils_1 = __webpack_require__(/*! ./Utils */ \"./src/client/Utils.ts\");\nModule.register(\"MMM-BoschSmartHome\", {\n    defaults: {\n        mocked: false,\n        debug: false,\n        header: null,\n        host: \"192.168.0.150\",\n        name: \"MMM-BoschSmartHome\",\n        identifier: \"MMM-BoschSmartHome\",\n        password: \"\",\n        width: \"340px\",\n        refreshIntervalInSeconds: 60,\n        displayRoomIcons: false,\n        displayThermostats: false,\n        airquality: {\n            purity: \"bar\",\n            humidity: \"bar\",\n            temperature: \"bar\",\n            preferredTemperatureProvider: \"Twinguard\",\n            preferredHumidityProvider: \"Twinguard\" // Twinguard or ClimateControl\n        }\n    },\n    getStyles() {\n        return [\"font-awesome.css\", \"MMM-BoschSmartHome.css\"];\n    },\n    getTranslations() {\n        return {\n            en: \"translations/en.json\",\n            de: \"translations/de.json\"\n        };\n    },\n    getTemplate() {\n        return \"templates/MMM-BoschSmartHome.njk\";\n    },\n    getTemplateData() {\n        return {\n            config: this.config,\n            rooms: this.rooms,\n            error: this.error,\n            utils: Utils_1.default\n        };\n    },\n    getHeader() {\n        return this.config.header;\n    },\n    start() {\n        // Override defaults\n        this.nunjucksEnvironment().loaders[0].async = false;\n        this.nunjucksEnvironment().loaders[0].useCache = true;\n        this.rooms = [];\n        this.error = null;\n        this.loadData();\n        this.scheduleUpdate();\n        this.updateDom();\n    },\n    scheduleUpdate() {\n        const self = this;\n        setInterval(() => {\n            self.loadData();\n        }, this.config.refreshIntervalInSeconds * 1000);\n    },\n    loadData() {\n        this.sendSocketNotification(\"GET_STATUS\", this.config);\n    },\n    socketNotificationReceived(notificationIdentifier, payload) {\n        if (notificationIdentifier === \"STATUS_RESULT\") {\n            this.error = null;\n            this.rooms = payload;\n            this.updateDom();\n            console.log(this.rooms);\n        }\n        else if (notificationIdentifier === \"ERROR\") {\n            this.error = payload;\n            this.updateDom();\n        }\n    }\n});\n\n\n//# sourceURL=webpack://mmm-bosch-smart-home/./src/client/Client.ts?");

/***/ }),

/***/ "./src/client/Utils.ts":
/*!*****************************!*\
  !*** ./src/client/Utils.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass BSHUtils {\n    static getRoomIcon(iconId) {\n        switch (iconId) {\n            case \"icon_room_bathroom\":\n                return \"fa-bath\";\n            case \"icon_room_bedroom\":\n                return \"fa-bed\";\n            case \"icon_room_office\":\n                return \"fa-briefcase\";\n            case \"icon_room_living_room\":\n                return \"fa-couch\";\n            case \"icon_room_dining_room\":\n                return \"fa-utensils\";\n            default:\n                return \"fa-house-user\";\n        }\n    }\n    static getLowBatteryDevices(devices) {\n        const response = [];\n        for (const device of devices) {\n            const batteryLevelService = device.services.find((service) => service.id === \"BatteryLevel\");\n            if (batteryLevelService && batteryLevelService.faults) {\n                response.push(device.name);\n            }\n        }\n        return response;\n    }\n    static getSwitchedOnHueDevices(devices) {\n        const hueLights = devices.filter((device) => device.deviceModel === \"HUE_LIGHT\");\n        let switchedOnDevices = [];\n        hueLights.forEach((hueLight) => {\n            const binarySwitchService = hueLight.services.find((service) => service.id === \"BinarySwitch\");\n            if (binarySwitchService.state.on &&\n                switchedOnDevices.indexOf(hueLight.name) <= 0) {\n                switchedOnDevices.push(hueLight.name);\n            }\n        });\n        return switchedOnDevices;\n    }\n    static getOpenShutters(devices) {\n        const shutterContactDevices = devices.filter((device) => device.deviceModel === \"SWD\");\n        let openShutters = [];\n        shutterContactDevices.forEach((shutterContactDevice) => {\n            const shutterContactService = shutterContactDevice.services.find((service) => service.id === \"ShutterContact\");\n            if (shutterContactService.state.value !== \"CLOSED\" &&\n                openShutters.indexOf(shutterContactDevice.profile) <= 0) {\n                openShutters.push(shutterContactDevice.profile);\n            }\n        });\n        return openShutters;\n    }\n    static getClimateControlService(devices) {\n        const climateControlDevice = devices.find((device) => device.deviceModel === \"ROOM_CLIMATE_CONTROL\");\n        if (!climateControlDevice)\n            return;\n        return climateControlDevice.services.find((service) => service.id === \"RoomClimateControl\");\n    }\n    static getTemperatureLevelService(devices) {\n        const climateControlDevice = devices.find((device) => device.deviceModel === \"ROOM_CLIMATE_CONTROL\");\n        if (!climateControlDevice)\n            return;\n        return climateControlDevice.services.find((service) => service.id === \"TemperatureLevel\");\n    }\n    static getAirQualityService(devices) {\n        const twinguardDevice = devices.find((device) => device.deviceModel === \"TWINGUARD\");\n        if (!twinguardDevice)\n            return \"\";\n        return twinguardDevice.services.find((service) => service.id === \"AirQualityLevel\");\n    }\n    static getThermostatServices(devices) {\n        let temperatureLevelDevices = devices.filter((device) => device.deviceModel === \"TRV\");\n        if (!temperatureLevelDevices)\n            return;\n        const services = [];\n        temperatureLevelDevices.forEach((temperatureLevelDevice) => {\n            const temperatureLevelService = temperatureLevelDevice.services.find((service) => service.id === \"TemperatureLevel\");\n            const valveTappetService = temperatureLevelDevice.services.find((service) => service.id === \"ValveTappet\");\n            services.push({ temperatureLevelService, valveTappetService });\n        });\n        return services;\n    }\n    static getDishWasherService(devices) {\n        let dishwasherDevice = devices.find((device) => device.deviceModel === \"HOMECONNECT_DISHWASHER\");\n        if (!dishwasherDevice)\n            return;\n        const service = dishwasherDevice.services.find((service) => service.id === \"HCDishwasher\");\n        service.deviceName = dishwasherDevice.name;\n        return service;\n    }\n    static getChartHumidityPercentage(humidity) {\n        return humidity > 100 ? 100 : humidity;\n    }\n    static getChartPurityPercentage(airQualityService) {\n        const result = (airQualityService.state.purity /\n            airQualityService.state.comfortZone.maxPurity) *\n            50;\n        return result > 100 ? 100 : result;\n    }\n    static getChartTemperaturePercentage(temperature, profile) {\n        if (!profile || !temperature)\n            return null;\n        console.log(\"profile\", profile, temperature);\n        const perfectTemp = profile.maxTemperature -\n            (profile.maxTemperature - profile.minTemperature);\n        const result = (temperature / perfectTemp) * 50;\n        return result > 100 ? 100 : result;\n    }\n}\nexports.default = BSHUtils;\n\n\n//# sourceURL=webpack://mmm-bosch-smart-home/./src/client/Utils.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/client/Client.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;