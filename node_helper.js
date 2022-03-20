/*! *****************************************************************************
  mmm-bosch-smart-home
  Version 1.4.0

  A client interface for the Bosch Smart Home System on the MagicMirror² platform.
  Please submit bugs at https://github.com/jalibu/MMM-BoschSmartHome/issues

  (c) Jan.Litzenburger@gmail.com
  Licence: MIT

  This file is auto-generated. Do not edit.
***************************************************************************** */

"use strict";var e=require("node_helper"),t=require("logger"),i=require("bosch-smart-home-bridge"),n=require("fs");function o(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(i){if("default"!==i){var n=Object.getOwnPropertyDescriptor(e,i);Object.defineProperty(t,i,n.get?n:{enumerable:!0,get:function(){return e[i]}})}})),t.default=e,Object.freeze(t)}var r=o(e),s=o(t),c=o(i),l=o(n);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function h(e,t,i,n){return new(i||(i=Promise))((function(o,r){function s(e){try{l(n.next(e))}catch(e){r(e)}}function c(e){try{l(n.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(s,c)}l((n=n.apply(e,t||[])).next())}))}var a,f=((a=function(e){return function(){e(this),this.name="EmptyError",this.message="no elements in sequence"}}((function(e){Error.call(e),e.stack=(new Error).stack}))).prototype=Object.create(Error.prototype),a.prototype.constructor=a,a);function u(e,t){var i="object"==typeof t;return new Promise((function(n,o){var r,s=!1;e.subscribe({next:function(e){r=e,s=!0},error:o,complete:function(){s?n(r):i?n(t.defaultValue):o(new f)}})}))}class d{constructor(){this.client=null,this.config=null,this.cert=null,this.key=null,this.logger=null,this.rooms=null}setConfig(e){this.config=e}establishConnection(){return h(this,void 0,void 0,(function*(){this.cert=l.readFileSync(`${__dirname}/client-cert.pem`).toString(),this.key=l.readFileSync(`${__dirname}/client-key.pem`).toString(),this.logger=new c.DefaultLogger,this.logger.fine=()=>{},this.logger.info=e=>{e.indexOf("Using existing certificate")>=0||e.indexOf("Check if client with identifier")>=0||s.info(e)};const e=c.BoschSmartHomeBridgeBuilder.builder().withHost(this.config.host).withClientCert(this.cert).withClientPrivateKey(this.key).withLogger(this.logger).build();yield u(e.pairIfNeeded(this.config.name,this.config.identifier,this.config.password)),this.client=e.getBshcClient(),s.info("Established connection to BSHB")}))}getRooms(){return h(this,void 0,void 0,(function*(){try{if(!this.client)try{yield this.establishConnection()}catch(e){throw Error(`Could not establish connection to BSHB: ${e.message}`)}if(!this.rooms){const{parsedResponse:e}=yield u(this.client.getRooms());this.rooms=e.sort(((e,t)=>this.config.roomOrder.indexOf(e.name)-this.config.roomOrder.indexOf(t.name))),s.info("Retrieved rooms from BSHB.")}const{parsedResponse:e}=yield u(this.client.getDevices()),{parsedResponse:t}=yield u(this.client.getDevicesServices());for(const i of e)i.services=t.filter((e=>e.deviceId===i.id));for(const t of this.rooms)t.devices=e.filter((e=>e.roomId===t.id));return Promise.resolve(this.rooms)}catch(e){return s.error(e.message),Promise.reject(e)}}))}}module.exports=r.create({start(){this.client=new d,s.log(`${this.name} helper method started...`)},socketNotificationReceived(e,t){return h(this,void 0,void 0,(function*(){if("BSH_CONFIG_REQUEST"===e){const e=t;this.client.setConfig(e),this.getClientData(),this.schedule||(this.schedule=setInterval(this.getClientData.bind(this),1e3*e.refreshIntervalInSeconds))}}))},getClientData(){return h(this,void 0,void 0,(function*(){try{const e=yield this.client.getRooms();this.sendSocketNotification("BSH_ROOMS_RESPONSE",e)}catch(e){this.sendSocketNotification("BSH_ERROR_RESPONSE",{type:"WARNING",message:e.message})}}))}});
