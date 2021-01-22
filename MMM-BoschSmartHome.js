(()=>{"use strict";var e={705:(e,t,r)=>{const i=r(916);Module.register("MMM-BoschSmartHome",{defaults:{mocked:!1,debug:!1,header:null,host:"192.168.0.150",name:"MMM-BoschSmartHome",identifier:"MMM-BoschSmartHome",password:"",width:"340px",refreshIntervalInSeconds:60,displayRoomIcons:!1,displayThermostats:!1,airquality:{purity:"bar",humidity:"bar",temperature:"bar",preferredTemperatureProvider:"Twinguard",preferredHumidityProvider:"Twinguard"}},getStyles:()=>["font-awesome.css","MMM-BoschSmartHome.css","Charts.css"],getTranslations:()=>({en:"translations/en.json",de:"translations/de.json"}),getTemplate:()=>"templates/MMM-BoschSmartHome.njk",getTemplateData(){return{config:this.config,rooms:this.rooms,error:this.error,utils:i.default}},getHeader(){return this.config.header},start(){this.nunjucksEnvironment().loaders[0].async=!1,this.nunjucksEnvironment().loaders[0].useCache=!0,this.rooms=[],this.error=null,this.loadData(),this.scheduleUpdate(),this.updateDom()},scheduleUpdate(){const e=this;setInterval((()=>{e.loadData()}),1e3*this.config.refreshIntervalInSeconds)},loadData(){this.sendSocketNotification("GET_STATUS",this.config)},socketNotificationReceived(e,t){"STATUS_RESULT"===e?(this.error=null,this.rooms=t,console.log(this.rooms),this.updateDom()):"ERROR"===e&&(this.error=t,this.updateDom())}})},916:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=class{static getRoomIcon(e){switch(e){case"icon_room_bathroom":return"fa-bath";case"icon_room_bedroom":return"fa-bed";case"icon_room_office":return"fa-briefcase";case"icon_room_living_room":return"fa-couch";default:return"fa-house-user"}}static getLowBatteryDevices(e){const t=[];for(const r of e){const e=r.services.find((e=>"BatteryLevel"===e.id));e&&e.faults&&t.push(r.name)}return t}static getSwitchedOnHueDevices(e){const t=e.filter((e=>"HUE_LIGHT"===e.deviceModel));let r=[];return t.forEach((e=>{e.services.find((e=>"BinarySwitch"===e.id)).state.on&&r.indexOf(e.name)<=0&&r.push(e.name)})),r}static getOpenShutters(e){const t=e.filter((e=>"SWD"===e.deviceModel));let r=[];return t.forEach((e=>{"CLOSED"!==e.services.find((e=>"ShutterContact"===e.id)).state.value&&r.indexOf(e.profile)<=0&&r.push(e.profile)})),r}static getClimateControlService(e){const t=e.find((e=>"ROOM_CLIMATE_CONTROL"===e.deviceModel));if(t)return t.services.find((e=>"RoomClimateControl"===e.id))}static getTemperatureLevelService(e){const t=e.find((e=>"ROOM_CLIMATE_CONTROL"===e.deviceModel));if(t)return t.services.find((e=>"TemperatureLevel"===e.id))}static getAirQualityService(e){const t=e.find((e=>"TWINGUARD"===e.deviceModel));return t?t.services.find((e=>"AirQualityLevel"===e.id)):""}static getThermostatServices(e){let t=e.filter((e=>"TRV"===e.deviceModel));if(!t)return;const r=[];return t.forEach((e=>{const t=e.services.find((e=>"TemperatureLevel"===e.id)),i=e.services.find((e=>"ValveTappet"===e.id));r.push({temperatureLevelService:t,valveTappetService:i})})),r}static getDishWasherService(e){let t=e.find((e=>"HOMECONNECT_DISHWASHER"===e.deviceModel));if(!t)return;const r=t.services.find((e=>"HCDishwasher"===e.id));return r.deviceName=t.name,r}static getChartHumidityPercentage(e){return e>100?100:e}static getChartPurityPercentage(e){const t=e.state.purity/e.state.comfortZone.maxPurity*50;return t>100?100:t}static getChartTemperaturePercentage(e,t){const r=e/(t.maxTemperature-(t.maxTemperature-t.minTemperature))*50;return r>100?100:r}}}},t={};!function r(i){if(t[i])return t[i].exports;var s=t[i]={exports:{}};return e[i](s,s.exports,r),s.exports}(705)})();