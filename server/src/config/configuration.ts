export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '/api',

  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'linkguard',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
  },

  externalApis: {
    virusTotal: {
      apiKey: process.env.VIRUSTOTAL_API_KEY,
      baseUrl:
        process.env.VIRUSTOTAL_BASE_URL || 'https://www.virustotal.com/api/v3',
    },
    googleSafeBrowsing: {
      apiKey: process.env.GOOGLE_SAFE_BROWSING_API_KEY,
      baseUrl:
        process.env.GOOGLE_SAFE_BROWSING_BASE_URL ||
        'https://safebrowsing.googleapis.com/v4',
    },
  },

  security: {
    corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['*'],
  },
});
