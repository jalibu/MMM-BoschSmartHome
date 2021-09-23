/*! *****************************************************************************
  mmm-bosch-smart-home
  Version 1.1.1

  A client interface for the Bosch Smart Home System on the MagicMirror² platform.
  Please submit bugs at https://github.com/jalibu/MMM-BoschSmartHome/issues

  (c) Jan.Litzenburger@gmail.com
  Licence: MIT

  This file is auto-generated. Do not edit.
***************************************************************************** */

!function(e){"use strict";function t(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(r){if("default"!==r){var i=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,i.get?i:{enumerable:!0,get:function(){return e[r]}})}})),t.default=e,Object.freeze(t)}var r=t(e);class i{static getRoomIcon(e){switch(e){case"icon_room_bathroom":return"fa-bath";case"icon_room_bedroom":return"fa-bed";case"icon_room_office":return"fa-briefcase";case"icon_room_living_room":return"fa-couch";case"icon_room_dining_room":return"fa-utensils";default:return"fa-house-user"}}static getLowBatteryDevices(e){const t=[];for(const r of e){const e=r.services.find((e=>"BatteryLevel"===e.id));e&&e.faults&&t.push(r.name)}return t}static getSwitchedOnHueDevices(e){const t=e.filter((e=>"HUE_LIGHT"===e.deviceModel)),r=[];return t.forEach((e=>{e.services.find((e=>"BinarySwitch"===e.id)).state.on&&r.indexOf(e.name)<=0&&r.push(e.name)})),r}static getOpenShutters(e){const t=e.filter((e=>"SWD"===e.deviceModel)),r=[];return t.forEach((e=>{"CLOSED"!==e.services.find((e=>"ShutterContact"===e.id)).state.value&&r.indexOf(e.profile)<=0&&r.push(e.profile)})),r}static getClimateControlService(e){const t=e.find((e=>"ROOM_CLIMATE_CONTROL"===e.deviceModel));return t?t.services.find((e=>"RoomClimateControl"===e.id)):null}static getTemperatureLevelService(e){const t=e.find((e=>"ROOM_CLIMATE_CONTROL"===e.deviceModel));return t?t.services.find((e=>"TemperatureLevel"===e.id)):null}static getAirQualityService(e){const t=e.find((e=>"TWINGUARD"===e.deviceModel));return t?t.services.find((e=>"AirQualityLevel"===e.id)):null}static getThermostatServices(e){const t=e.filter((e=>"TRV"===e.deviceModel));if(!t)return null;const r=[];return t.forEach((e=>{const t=e.services.find((e=>"TemperatureLevel"===e.id)),i=e.services.find((e=>"ValveTappet"===e.id));r.push({temperatureLevelService:t,valveTappetService:i,name:e.name})})),r}static getDishWasherService(e){const t=e.find((e=>"HOMECONNECT_DISHWASHER"===e.deviceModel));if(!t)return null;const r=t.services.find((e=>"HCDishwasher"===e.id));return r.deviceName=t.name,r}static getChartHumidityPercentage(e){return e>100?100:e}static getChartPurityPercentage(e){const t=e.state.purity/e.state.comfortZone.maxPurity*50;return t>100?100:t}static getChartTemperaturePercentage(e,t){if(!t||!e)return null;const r=e/(t.maxTemperature-(t.maxTemperature-t.minTemperature))*50;return r>100?100:r}static isHidden(e,t,r){return r.hideComponents[e.name]&&r.hideComponents[e.name].indexOf(t)>=0}}Module.register("MMM-BoschSmartHome",{defaults:{mocked:!1,debug:!1,header:null,host:"192.168.0.150",name:"MMM-BoschSmartHome",identifier:"MMM-BoschSmartHome",password:"",width:"340px",refreshIntervalInSeconds:60,displayRoomIcons:!1,hideComponents:{},airquality:{purity:"bar",humidity:"bar",temperature:"bar",preferredTemperatureProvider:"Twinguard",preferredHumidityProvider:"Twinguard"},temperatureLevel:{displayCurrentTemperature:!0,displayTargetTemperature:!0,forceRowTile:!0},thermostats:{display:!0,displayName:!1}},getStyles:()=>["font-awesome.css","MMM-BoschSmartHome.css"],getTranslations:()=>({en:"translations/en.json",de:"translations/de.json"}),getTemplate:()=>"templates/MMM-BoschSmartHome.njk",getTemplateData(){return{config:this.config,rooms:this.rooms,error:this.error,utils:i}},getHeader(){return this.config.header},start(){this.rooms=[],this.error=null,this.sendSocketNotification("BSH_CONFIG_REQUEST",this.config),this.updateDom()},socketNotificationReceived(e,t){"BSH_ROOMS_RESPONSE"===e?(this.error=null,this.rooms=t,this.updateDom(),r.log("BSH Rooms",this.rooms)):"BSH_ERROR_RESPONSE"===e&&(this.error=t,console.log(this.error),this.updateDom())}})}(Log);
