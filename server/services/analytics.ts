import Analytics from 'analytics-node';

export default class AppAnalytics {
  segmentAnalytics: Analytics;

  constructor() {
    // Segment
    if (process.env.SEGMENT_API_KEY) {
      this.segmentAnalytics = new Analytics(process.env.SEGMENT_API_KEY);
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

    return 'OK';
  }
}
