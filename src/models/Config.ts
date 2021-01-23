export type Config = {
  mocked: boolean;
  debug: boolean;
  header: string;
  host: string;
  name: string;
  identifier: string;
  password: string;
  width: string;
  hideComponents: any;
  refreshIntervalInSeconds: number;
  displayRoomIcons: boolean;
  displayThermostats: boolean;
  airquality: Airquality;
};

type Airquality = {
  purity: string;
  humidity: string;
  temperature: string;
  preferredTemperatureProvider: string;
  preferredHumidityProvider: string;
};
