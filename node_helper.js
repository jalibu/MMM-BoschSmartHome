/*! *****************************************************************************
  mmm-bosch-smart-home
  Version 1.5.0

  A client interface for the Bosch Smart Home System on the MagicMirror² platform.
  Please submit bugs at https://github.com/jalibu/MMM-BoschSmartHome/issues

  © Jan.Litzenburger@gmail.com
  License: MIT

  This file is auto-generated. Do not edit.
***************************************************************************** */
"use strict";var e=require("node_helper"),t=require("logger"),i=require("bosch-smart-home-bridge"),n=require("fs");function r(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(i){if("default"!==i){var n=Object.getOwnPropertyDescriptor(e,i);Object.defineProperty(t,i,n.get?n:{enumerable:!0,get:function(){return e[i]}})}})),t.default=e,Object.freeze(t)}var o=r(e),s=r(t),c=r(i),h=r(n);function l(e,t,i,n){return new(i||(i=Promise))((function(r,o){function s(e){try{h(n.next(e))}catch(e){o(e)}}function c(e){try{h(n.throw(e))}catch(e){o(e)}}function h(e){var t;e.done?r(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(s,c)}h((n=n.apply(e,t||[])).next())}))}"function"==typeof SuppressedError&&SuppressedError;var f,a=((f=function(e){return function(){e(this),this.name="EmptyError",this.message="no elements in sequence"}}((function(e){Error.call(e),e.stack=(new Error).stack}))).prototype=Object.create(Error.prototype),f.prototype.constructor=f,f);function u(e,t){return new Promise((function(t,i){var n,r=!1;e.subscribe({next:function(e){n=e,r=!0},error:i,complete:function(){r?t(n):i(new a)}})}))}class d{constructor(){this.client=null,this.config=null,this.cert=null,this.key=null,this.logger=null,this.rooms=null}setConfig(e){this.config=e}establishConnection(){return l(this,void 0,void 0,(function*(){this.cert=h.readFileSync(`${__dirname}/client-cert.pem`).toString(),this.key=h.readFileSync(`${__dirname}/client-key.pem`).toString(),this.logger=new c.DefaultLogger,this.logger.debug=()=>{},this.logger.fine=()=>{},this.logger.info=e=>{e.indexOf("Using existing certificate")>=0||e.indexOf("Check if client with identifier")>=0||s.info(e)};const e=c.BoschSmartHomeBridgeBuilder.builder().withHost(this.config.host).withClientCert(this.cert).withClientPrivateKey(this.key).withLogger(this.logger).build();yield u(e.pairIfNeeded(this.config.name,this.config.identifier,this.config.password)),this.client=e.getBshcClient(),s.info("Established connection to BSHB")}))}getRooms(){return l(this,void 0,void 0,(function*(){try{if(!this.client)try{yield this.establishConnection()}catch(e){throw Error(`Could not establish connection to BSHB: ${e.message}`)}if(!this.rooms){const{parsedResponse:e}=yield u(this.client.getRooms());this.rooms=e.sort(((e,t)=>this.config.roomOrder.indexOf(e.name)-this.config.roomOrder.indexOf(t.name))),s.info("Retrieved rooms from BSHB.")}const{parsedResponse:e}=yield u(this.client.getDevices()),{parsedResponse:t}=yield u(this.client.getDevicesServices());for(const i of e)i.services=t.filter((e=>e.deviceId===i.id));for(const t of this.rooms)t.devices=e.filter((e=>e.roomId===t.id));return Promise.resolve(this.rooms)}catch(e){return s.error(e.message),Promise.reject(e)}}))}}module.exports=o.create({start(){this.client=new d,s.log(`${this.name} helper method started...`)},socketNotificationReceived(e,t){return l(this,void 0,void 0,(function*(){if("BSH_CONFIG_REQUEST"===e){const e=t;this.client.setConfig(e),this.getClientData(),this.schedule||(this.schedule=setInterval(this.getClientData.bind(this),1e3*e.refreshIntervalInSeconds))}}))},getClientData(){return l(this,void 0,void 0,(function*(){try{const e=yield this.client.getRooms();this.sendSocketNotification("BSH_ROOMS_RESPONSE",e)}catch(e){this.sendSocketNotification("BSH_ERROR_RESPONSE",{type:"WARNING",message:e.message})}}))}});
