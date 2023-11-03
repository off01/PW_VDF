// config.ts

import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const currentEnvPath = path.resolve(__dirname, './currentEnv.json');
const currentEnvData = fs.readFileSync(currentEnvPath, 'utf8');
const currentEnv = JSON.parse(currentEnvData).NODE_ENV || 'PRE';


// Pro .env
dotenv.config({ path: path.resolve(__dirname, `${currentEnv}/.env`) });

// Pro counter.json
const counter: any = require(path.resolve(__dirname, `./${currentEnv}/counter.json`));

// Pro db.config.ts
const dbConfig = require(path.resolve(__dirname, `${currentEnv}/db.config`));

const config = {
    currentEnv,
    counter,
    dbConfig,
    baseURL: process.env.URL,
};

export default config;