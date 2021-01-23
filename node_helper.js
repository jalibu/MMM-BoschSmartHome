/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/server/Server.ts":
/*!******************************!*\
  !*** ./src/server/Server.ts ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst NodeHelper = __webpack_require__(/*! node_helper */ \"node_helper\");\nconst fs = __webpack_require__(/*! fs */ \"fs\");\nconst BSMB = __webpack_require__(/*! bosch-smart-home-bridge */ \"bosch-smart-home-bridge\");\nmodule.exports = NodeHelper.create({\n    cert: null,\n    key: null,\n    logger: null,\n    client: null,\n    rooms: null,\n    start() {\n        this.cert = fs.readFileSync(`${__dirname}/client-cert.pem`).toString();\n        this.key = fs.readFileSync(`${__dirname}/client-key.pem`).toString();\n        // Override Logger to avoid some annoying logs\n        this.logger = new BSMB.DefaultLogger();\n        this.logger.fine = () => { };\n        this.logger.info = (msg) => {\n            if (msg.indexOf(\"Using existing certificate\") >= 0 ||\n                msg.indexOf(\"Check if client with identifier\") >= 0) {\n                return;\n            }\n            console.info(msg);\n        };\n        console.log(`${this.name} helper method started...`);\n    },\n    establishConnection(config) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (!this.client) {\n                try {\n                    const bshb = BSMB.BoschSmartHomeBridgeBuilder.builder()\n                        .withHost(config.host)\n                        .withClientCert(this.cert)\n                        .withClientPrivateKey(this.key)\n                        .withLogger(this.logger)\n                        .build();\n                    yield bshb\n                        .pairIfNeeded(config.name, config.identifier, config.password)\n                        .toPromise();\n                    this.client = bshb.getBshcClient();\n                }\n                catch (err) {\n                    console.log(err);\n                }\n            }\n        });\n    },\n    loadData() {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                if (!this.rooms) {\n                    const { parsedResponse: rooms } = yield this.client.getRooms().toPromise();\n                    this.rooms = rooms;\n                }\n                const { parsedResponse: devices } = yield this.client.getDevices().toPromise();\n                const { parsedResponse: services } = yield this.client.getDevicesServices().toPromise();\n                for (const device of devices) {\n                    device.services = services.filter((service) => service.deviceId === device.id);\n                }\n                for (const room of this.rooms) {\n                    room.devices = devices.filter((device) => device.roomId === room.id);\n                }\n            }\n            catch (err) {\n                console.error(err.message);\n            }\n        });\n    },\n    socketNotificationReceived(notification, config) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (notification === \"GET_STATUS\") {\n                if (config.mocked) {\n                    const data = fs.readFileSync(__dirname + \"/debugResponse.json\");\n                    this.rooms = JSON.parse(data);\n                }\n                else {\n                    yield this.establishConnection(config);\n                    yield this.loadData();\n                    if (config.debug) {\n                        fs.writeFileSync(__dirname + \"/debugResponse.json\", JSON.stringify(this.rooms));\n                    }\n                }\n                this.sendSocketNotification(\"STATUS_RESULT\", this.rooms);\n            }\n            else {\n                console.warn(`${notification} is invalid notification`);\n            }\n        });\n    }\n});\n\n\n//# sourceURL=webpack://mmm-bosch-smart-home/./src/server/Server.ts?");

/***/ }),

/***/ "bosch-smart-home-bridge":
/*!******************************************!*\
  !*** external "bosch-smart-home-bridge" ***!
  \******************************************/
/***/ ((module) => {

module.exports = require("bosch-smart-home-bridge");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");;

/***/ }),

/***/ "node_helper":
/*!******************************!*\
  !*** external "node_helper" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node_helper");;

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/server/Server.ts");
/******/ })()
;