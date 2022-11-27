import Analytics from 'analytics-node';
import NewRelicHelper from './newrelic';

export default class AppAnalytics {
  segmentAnalytics: Analytics;
  newRelicAnalytics: NewRelicHelper;

  constructor() {
    // Segment
    if (process.env.SEGMENT_API_KEY) {
      this.segmentAnalytics = new Analytics(process.env.SEGMENT_API_KEY);
    }

    // New Relic
    if (process.env.NEW_RELIC_LICENSE_KEY) {
      this.newRelicAnalytics = new NewRelicHelper(
        process.env.NEW_RELIC_LICENSE_KEY,
      );
    }
  }

  identify(userId, traits) {
    // Segment
    if (process.env.SEGMENT_API_KEY) {
      this.segmentAnalytics.identify({
        userId: userId,
        traits: traits,
      });
    }
    return 'OK';
  }

  track(userId, event, properties) {
    // Segment
    if (process.env.SEGMENT_API_KEY) {
      this.segmentAnalytics.track({
        userId: userId,
        event: event,
        properties: properties,
      });
    }

    // New Relic
    if (process.env.NEW_RELIC_LICENSE_KEY) {
      this.newRelicAnalytics.track({
        userId: userId,
        event: event,
        properties: properties,
      });
    }
    return 'OK';
  }
}
