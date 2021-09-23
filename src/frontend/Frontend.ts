import * as Log from 'logger'
import Utils from './Utils'
import { Config } from '../types/Config'

Module.register<Config>('MMM-BoschSmartHome', {
  defaults: {
    mocked: false,
    debug: false,
    header: null,
    host: '192.168.0.150',
    name: 'MMM-BoschSmartHome',
    identifier: 'MMM-BoschSmartHome',
    password: '',
    width: '340px',
    refreshIntervalInSeconds: 60,
    displayRoomIcons: false,
    hideComponents: {}, // see README.md
    airquality: {
      purity: 'bar', // one of [tile, bar, donut, none]
      humidity: 'bar', // one of [tile, bar, donut, none]
      temperature: 'bar', // one of [tile, bar, donut, none]
      preferredTemperatureProvider: 'Twinguard', // Twinguard or ClimateControl
      preferredHumidityProvider: 'Twinguard' // Twinguard or ClimateControl
    },
    temperatureLevel: {
      displayCurrentTemperature: true,
      displayTargetTemperature: true,
      forceRowTile: true
    },
    thermostats: {
      display: true,
      displayName: false
    }
  },

  getStyles() {
    return ['font-awesome.css', 'MMM-BoschSmartHome.css']
  },

  getTranslations() {
    return {
      en: 'translations/en.json',
      de: 'translations/de.json'
    }
  },

  getTemplate() {
    return 'templates/MMM-BoschSmartHome.njk'
  },

  getTemplateData() {
    return {
      config: this.config,
      rooms: this.rooms,
      error: this.error,
      utils: Utils
    }
  },

  getHeader() {
    return this.config.header
  },

  start() {
    this.rooms = []
    this.error = null

    this.sendSocketNotification('BSH_CONFIG_REQUEST', this.config)
    this.updateDom()
  },

  socketNotificationReceived(notificationIdentifier: string, payload: unknown) {
    if (notificationIdentifier === 'BSH_ROOMS_RESPONSE') {
      this.error = null
      this.rooms = payload
      this.updateDom()

      Log.log('BSH Rooms', this.rooms)
    } else if (notificationIdentifier === 'BSH_ERROR_RESPONSE') {
      this.error = payload
      console.log(this.error)
      this.updateDom()
    }
  }
})
