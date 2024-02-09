// config.ts

import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

const currentEnvPath = path.resolve(__dirname, "./currentEnv.json");
const currentEnvData = fs.readFileSync(currentEnvPath, "utf8");
const currentEnv = JSON.parse(currentEnvData).NODE_ENV || "PRE";

// Pro .env
dotenv.config({ path: path.resolve(__dirname, `${currentEnv}/.env`) });

// Pro counter.json
const counter: any = require(path.resolve(__dirname, `./${currentEnv}/counter.json`));

// Pro db.config.ts
const dbConfig = require(path.resolve(__dirname, `${currentEnv}/db.config`));

// EMS konfigurace - prozatím nedořešené
const emsConfig = {
  user: process.env.EMS_USER || 'defaultUser',
  password: process.env.EMS_PASSWORD || 'defaultPassword',
  host: process.env.EMS_URL || 'aczfil10s-z1.vfcz.dc-ratingen.de',
  port: parseInt(process.env.EMS_PORT, 10) || 7222
};

const config = {
  currentEnv,
  counter,
  dbConfig,
  baseURL: process.env.URL,
  emsConfig,
};

export default config;
