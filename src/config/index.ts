/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import _ from 'lodash';
import { Config } from '../types/config';

const { APP_REGION = 'sg', APP_ENV = 'dev' } = process.env;
console.log('APP_REGION', APP_REGION);
console.log('APP_ENV', APP_ENV);

const defaultConfig = require(`./${APP_REGION}/default`).default;
let destConfig: Config | null = null;

export const getConfig = (): Config => {
  if (destConfig) {
    return destConfig;
  }
  if (APP_ENV === 'pretest') {
    const testConfig = require(`./${APP_REGION}/pretest`).default;
    destConfig = _.defaultsDeep(testConfig, defaultConfig);
  } else if (APP_ENV === 'test') {
    const testConfig = require(`./${APP_REGION}/test`).default;
    destConfig = _.defaultsDeep(testConfig, defaultConfig);
  } else if (APP_ENV === 'staging') {
    const stagingConfig = require(`./${APP_REGION}/staging`).default;
    destConfig = _.defaultsDeep(stagingConfig, defaultConfig);
  } else if (APP_ENV === 'uat') {
    const uatConfig = require(`./${APP_REGION}/uat`).default;
    destConfig = _.defaultsDeep(uatConfig, defaultConfig);
  } else if (APP_ENV === 'live') {
    const liveConfig = require(`./${APP_REGION}/live`).default;
    destConfig = _.defaultsDeep(liveConfig, defaultConfig);
  }

  console.log('CONFIG => ', destConfig || defaultConfig);
  return destConfig || defaultConfig;
};

export default {};
