import { BaseAPI } from './base';

const LIMIT_LIVE_ACTIVITY = 10;
const LIMIT_TOP_DOMAINS = 10;
const LIMIT_TIME_SERIES_DAYS = 7;

class UrlAPI extends BaseAPI {
  async getLiveActivity(limit: number = LIMIT_LIVE_ACTIVITY) {
    try {
      const response = await this.httpClientPrivate.get(
        `/url/live-activity?limit=${limit}`,
        {
          withCredentials: true,
        },
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // GET: /url/overview
  async getOverview() {
    try {
      const response = await this.httpClientPrivate.get(`/url/overview`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // GET: /url/top-domains?limit=10
  async getTopDomains(limit: number = LIMIT_TOP_DOMAINS) {
    try {
      const response = await this.httpClientPrivate.get(
        `/url/top-domains?limit=${limit}`,
        {
          withCredentials: true,
        },
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // GET: /url/time-series?days=7
  async getTimeSeries(days: number = LIMIT_TIME_SERIES_DAYS) {
    try {
      const response = await this.httpClientPrivate.get(`/url/time-series?days=${days}`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export const urlAPI: UrlAPI = new UrlAPI();
