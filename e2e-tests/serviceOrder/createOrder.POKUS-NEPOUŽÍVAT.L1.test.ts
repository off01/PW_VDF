import { test, expect } from "@playwright/test";
import { fetchDataModification } from "@helper/dbQuerries";
import { getLocationFlatList } from "@datafactory/getLocationFlatList";

import * as fs from "fs";

const L1config = JSON.parse(fs.readFileSync("config/dataL1.json", "utf8"));

test.describe("Modifikace L1 - SWAP HW", async () => {
  L1config.hardwarePairs.forEach((pair) => {
    test(`Změna HW z ${pair.original} na ${pair.new}`, async ({ request }) => {
      const data = await fetchDataModification(pair.original);
      if (!data) {
        throw new Error("Failed to fetch idWHS_SO from the database.");
      }

      const idASSET_sub = data.WHS_ASSET_ID1;
      const idASSET_ser = data.WHS_ASSET_ID2;
      const idASSET_ass1 = data.WHS_ASSET_ID3;
      const idASSET_ass2 = data.WHS_ASSET_ID4;
      const WHSDATA = data.Tarif;
      const macAddress = data.macAddress;
      const WHSHW_OG = data.HW;
      let idWHS_SO: string;

      console.log(idASSET_sub);
      console.log(idASSET_ser);
      console.log(idASSET_ass1);
      console.log(idASSET_ass2);
      console.log(WHSDATA);
      console.log(macAddress);
      console.log(WHSHW_OG);
    });
  });
  test(`Aktivační objednávka FF - Schválená`, async ({ request }) => {
    let idWHS_SO: string; // eslint-disable-line

    await test.step("Create", async () => {
      const { body: requestBody, headers } = await getLocationFlatList("1026629", "WHS_SO_08000003530");

      const response = await request.post(`https://v4tibco-int.vfcz.dc-ratingen.de:12096/WhsApiResource`, {
        data: requestBody,
        headers: headers,
      });

      //await checkResponseStatus(response, 201);

      const body = await response.text();
      //expect(checkForNullValues(body)).toBe(false);
      console.log(body);
      //idWHS_SO = body.id[1].value;
      //console.log(idbuildingId)
      //console.log(idWHS_SO)
    });
  });
});
