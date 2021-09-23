import * as Log from 'logger'
import * as BSHB from 'bosch-smart-home-bridge'
import * as fs from 'fs'
import { Config } from '../types/Config'
import { Device } from '../types/Device'
import { Service } from '../types/Service'
import { Room } from '../types/Room'

export default class BshbClient {
  private client: BSHB.BshcClient = null
  private config: Config = null
  private cert: string = null
  private key: string = null
  private logger: BSHB.DefaultLogger = null
  private rooms: Room[] = null

  setConfig(config: Config): void {
    this.config = config
  }

  private async establishConnection(): Promise<void> {
    this.cert = fs.readFileSync(`${__dirname}/client-cert.pem`).toString()
    this.key = fs.readFileSync(`${__dirname}/client-key.pem`).toString()

    // Override Logger to avoid some annoying logs
    this.logger = new BSHB.DefaultLogger()
    this.logger.fine = () => {}
    this.logger.info = (msg: string) => {
      if (msg.indexOf('Using existing certificate') >= 0 || msg.indexOf('Check if client with identifier') >= 0) {
        return
      }
      Log.info(msg)
    }

    const bshb = BSHB.BoschSmartHomeBridgeBuilder.builder()
      .withHost(this.config.host)
      .withClientCert(this.cert)
      .withClientPrivateKey(this.key)
      .withLogger(this.logger)
      .build()

    await bshb.pairIfNeeded(this.config.name, this.config.identifier, this.config.password).toPromise()
    this.client = bshb.getBshcClient()

    Log.info('Established connection to BSHB')
  }

  public async getRooms(): Promise<Room[]> {
    try {
      if (!this.client) {
        try {
          await this.establishConnection()
        } catch (err) {
          throw Error(`Could not establish connection to BSHB: ${err.message}`)
        }
      }

      if (!this.rooms) {
        const { parsedResponse: rooms } = await this.client.getRooms().toPromise()
        this.rooms = rooms
        Log.info('Retrieved rooms from BSHB.')
      }

      const {
        parsedResponse: devices
      }: {
        parsedResponse: Device[]
      } = await this.client.getDevices().toPromise()

      const {
        parsedResponse: services
      }: {
        parsedResponse: Service[]
      } = await this.client.getDevicesServices().toPromise()

      for (const device of devices) {
        device.services = services.filter((service) => service.deviceId === device.id)
      }

      for (const room of this.rooms) {
        room.devices = devices.filter((device) => device.roomId === room.id)
      }

      return Promise.resolve(this.rooms)
    } catch (err) {
      Log.error(err.message)

      return Promise.reject(err)
    }
  }
}
