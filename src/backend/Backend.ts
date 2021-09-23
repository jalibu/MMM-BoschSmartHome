import * as NodeHelper from 'node_helper'
import * as Log from 'logger'
import BshbClient from './BshClient'
import { Config } from '../types/Config'

module.exports = NodeHelper.create({
  start() {
    this.client = new BshbClient()
    Log.log(`${this.name} helper method started...`)
  },

  async socketNotificationReceived(notification, payload) {
    if (notification === 'BSH_CONFIG_REQUEST') {
      const config = payload as Config
      this.client.setConfig(config)

      this.getClientData()
      if (!this.schedule) {
        this.schedule = setInterval(this.getClientData.bind(this), config.refreshIntervalInSeconds * 1000)
      }
    }
  },

  async getClientData() {
    try {
      const rooms = await this.client.getRooms()
      this.sendSocketNotification('BSH_ROOMS_RESPONSE', rooms)
    } catch (err) {
      this.sendSocketNotification('BSH_ERROR_RESPONSE', {
        type: 'WARNING',
        message: err.message
      })
    }
  }
})
