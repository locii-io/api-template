import axios from 'axios';

export default class NewRelicHelper {
  licenseKey: string;
  eventApiUrl: string;

  constructor(licenseKey) {
    this.licenseKey = licenseKey;
    this.eventApiUrl = `https://insights-collector.newrelic.com/v1/accounts/${process.env.NEW_RELIC_ACCOUNT_ID}/events`;
  }

  async track({ userId, event, properties }) {
    const data = [
      {
        eventType: event,
        userId: userId,
        properties: properties,
      },
    ];
    if (this.licenseKey) {
      try {
        const res = await axios.post(this.eventApiUrl, data);
        console.log(`Status: ${res.status}`);
        console.log('Body: ', res.data);
      } catch (err) {
        console.error(err);
      }
    }
    return 'OK';
  }
}
