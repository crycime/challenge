export default {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  SERVICES: {
    defaultTimeOut: 30000,
    nomics: {
      url: 'https://api.nomics.com/v1',
      apiKey: process.env.NOMICS_API_KEY,
    },
  },
  REDIS: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    db: process.env.REDIS_DB || 0,
    ttl: null,
    name: 'cache',
    password: process.env.REDIS_PASSWORD || '',
    maxRetriesPerRequest: 3,
  },
  REDIS_QUEUE: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    db: 2,
    ttl: null,
    password: process.env.REDIS_PASSWORD || '',
    maxRetriesPerRequest: 3,
  },
};
