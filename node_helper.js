/*! *****************************************************************************
  mmm-bosch-smart-home
  Version 1.1.1

  A client interface for the Bosch Smart Home System on the MagicMirror² platform.
  Please submit bugs at https://github.com/jalibu/MMM-BoschSmartHome/issues

  (c) Jan.Litzenburger@gmail.com
  Licence: MIT

  This file is auto-generated. Do not edit.
***************************************************************************** */

"use strict";var e=require("node_helper"),t=require("fs"),i=require("bosch-smart-home-bridge");function o(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(i){if("default"!==i){var o=Object.getOwnPropertyDescriptor(e,i);Object.defineProperty(t,i,o.get?o:{enumerable:!0,get:function(){return e[i]}})}})),t.default=e,Object.freeze(t)}var n=o(e),r=o(t),s=o(i);
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
function c(e,t,i,o){return new(i||(i=Promise))((function(n,r){function s(e){try{l(o.next(e))}catch(e){r(e)}}function c(e){try{l(o.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?n(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(s,c)}l((o=o.apply(e,t||[])).next())}))}module.exports=n.create({cert:null,key:null,logger:null,client:null,rooms:null,start(){this.cert=r.readFileSync(`${__dirname}/client-cert.pem`).toString(),this.key=r.readFileSync(`${__dirname}/client-key.pem`).toString(),this.logger=new s.DefaultLogger,this.logger.fine=()=>{},this.logger.info=e=>{e.indexOf("Using existing certificate")>=0||e.indexOf("Check if client with identifier")>=0||console.info(e)},console.log(`${this.name} helper method started...`)},establishConnection(e){return c(this,void 0,void 0,(function*(){if(!this.client)try{const t=s.BoschSmartHomeBridgeBuilder.builder().withHost(e.host).withClientCert(this.cert).withClientPrivateKey(this.key).withLogger(this.logger).build();yield t.pairIfNeeded(e.name,e.identifier,e.password).toPromise(),this.client=t.getBshcClient()}catch(e){console.log(e)}}))},loadData(){return c(this,void 0,void 0,(function*(){try{if(!this.rooms){const{parsedResponse:e}=yield this.client.getRooms().toPromise();this.rooms=e}const{parsedResponse:e}=yield this.client.getDevices().toPromise(),{parsedResponse:t}=yield this.client.getDevicesServices().toPromise();for(const i of e)i.services=t.filter((e=>e.deviceId===i.id));for(const t of this.rooms)t.devices=e.filter((e=>e.roomId===t.id))}catch(e){console.error(e.message)}}))},socketNotificationReceived(e,t){return c(this,void 0,void 0,(function*(){if("GET_STATUS"===e){if(t.mocked){const e=r.readFileSync(`${__dirname}/debugResponse.json`).toString();this.rooms=JSON.parse(e)}else yield this.establishConnection(t),yield this.loadData(),t.debug&&r.writeFileSync(`${__dirname}/debugResponse.json`,JSON.stringify(this.rooms));this.sendSocketNotification("STATUS_RESULT",this.rooms)}else console.warn(`${e} is invalid notification`)}))}});
