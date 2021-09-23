/*! *****************************************************************************
  mmm-bosch-smart-home
  Version 1.1.1

  A client interface for the Bosch Smart Home System on the MagicMirror² platform.
  Please submit bugs at https://github.com/jalibu/MMM-BoschSmartHome/issues

  (c) Jan.Litzenburger@gmail.com
  Licence: MIT

  This file is auto-generated. Do not edit.
***************************************************************************** */

"use strict";var e=require("node_helper"),t=require("logger"),i=require("bosch-smart-home-bridge"),o=require("fs");function n(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(i){if("default"!==i){var o=Object.getOwnPropertyDescriptor(e,i);Object.defineProperty(t,i,o.get?o:{enumerable:!0,get:function(){return e[i]}})}})),t.default=e,Object.freeze(t)}var s=n(e),r=n(t),c=n(i),h=n(o);
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
function l(e,t,i,o){return new(i||(i=Promise))((function(n,s){function r(e){try{h(o.next(e))}catch(e){s(e)}}function c(e){try{h(o.throw(e))}catch(e){s(e)}}function h(e){var t;e.done?n(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(r,c)}h((o=o.apply(e,t||[])).next())}))}class a{constructor(){this.client=null,this.config=null,this.cert=null,this.key=null,this.logger=null,this.rooms=null}setConfig(e){this.config=e}establishConnection(){return l(this,void 0,void 0,(function*(){this.cert=h.readFileSync(`${__dirname}/client-cert.pem`).toString(),this.key=h.readFileSync(`${__dirname}/client-key.pem`).toString(),this.logger=new c.DefaultLogger,this.logger.fine=()=>{},this.logger.info=e=>{e.indexOf("Using existing certificate")>=0||e.indexOf("Check if client with identifier")>=0||r.info(e)};const e=c.BoschSmartHomeBridgeBuilder.builder().withHost(this.config.host).withClientCert(this.cert).withClientPrivateKey(this.key).withLogger(this.logger).build();yield e.pairIfNeeded(this.config.name,this.config.identifier,this.config.password).toPromise(),this.client=e.getBshcClient(),r.info("Established connection to BSHB")}))}getRooms(){return l(this,void 0,void 0,(function*(){try{if(!this.client)try{yield this.establishConnection()}catch(e){throw Error(`Could not establish connection to BSHB: ${e.message}`)}if(!this.rooms){const{parsedResponse:e}=yield this.client.getRooms().toPromise();this.rooms=e,r.info("Retrieved rooms from BSHB.")}const{parsedResponse:e}=yield this.client.getDevices().toPromise(),{parsedResponse:t}=yield this.client.getDevicesServices().toPromise();for(const i of e)i.services=t.filter((e=>e.deviceId===i.id));for(const t of this.rooms)t.devices=e.filter((e=>e.roomId===t.id));return Promise.resolve(this.rooms)}catch(e){return r.error(e.message),Promise.reject(e)}}))}}module.exports=s.create({start(){this.client=new a,r.log(`${this.name} helper method started...`)},socketNotificationReceived(e,t){return l(this,void 0,void 0,(function*(){if("BSH_CONFIG_REQUEST"===e){const e=t;this.client.setConfig(e),this.getClientData(),this.schedule||(this.schedule=setInterval(this.getClientData.bind(this),1e3*e.refreshIntervalInSeconds))}}))},getClientData(){return l(this,void 0,void 0,(function*(){try{const e=yield this.client.getRooms();this.sendSocketNotification("BSH_ROOMS_RESPONSE",e)}catch(e){this.sendSocketNotification("BSH_ERROR_RESPONSE",{type:"WARNING",message:e.message})}}))}});
