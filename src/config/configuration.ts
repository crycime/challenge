import devConfig from './config.development';
import prodConfig from './config.production';

const getConfig = () => {
  switch (process.env.APP_ENV) {
    case 'development':
      return devConfig;
    case 'production':
      return prodConfig;
    default:
      return devConfig;
  }
};
export default () => ({ ...getConfig() });
