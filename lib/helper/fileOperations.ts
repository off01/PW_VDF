// lib/helper/helper.ts

import * as fs from "fs";

export async function getTariffs() {
    const config = JSON.parse(fs.readFileSync('config/tariffs.json', 'utf8'));
    return config;
}