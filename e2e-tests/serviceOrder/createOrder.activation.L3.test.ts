import { test, expect } from "@playwright/test";
import { createActivationL3OrderBody } from "@datafactory/createOrder";
import { checkL3 } from "@datafactory/serviceFeasibility";
import { getLocationFlatIdsWithCondition, getRandomElement } from "@helper/listofflats";
import { serviceOrderL3, serviceOrderL3Provisioning } from "@datafactory/serviceOrder";
import { waitForExpectedStatus } from "@helper/waitingStatus";
import { findIndexOfSpecificValue } from "@helper/findIndex";
import { checkResponseStatus, checkForNullValues } from "@helper/expectsAsserts";
import { parseXml } from "@helper/xmlParser";
import { getLocationFlatList } from "@datafactory/getLocationFlatList";
import { serviceOrderClosed } from "@datafactory/serviceOrder";
//import { getTariffs } from "../../lib/helper/fileOperations";
import * as fs from "fs";

const L3config = JSON.parse(fs.readFileSync("config/dataL3.json", "utf8"));

test.describe("Aktivace L3 spolu s HW", async () => {
  L3config.testConfigs.forEach((config) => {
    test(`Aktivační objednávka pro ${config.tariff} L3 s hardware typem ${config.hardwareType}`, async ({
      request,
    }) => {
      let idbuildingId: string;
      let idWHS_SO: string;
      let idlocationFlatId: string;
      let IndexOfWHSHWONT: number;

      await test.step("Create", async () => {
        const requestBody = await createActivationL3OrderBody(config.tariff, config.hardwareType);

        const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 201);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        //console.log(JSON.stringify(body, null, 2));
        idbuildingId =
          body.parts.lineItem[0].serviceSite.contactPeople[0].contactPerson.contactPoint[0].postal.characteristic
            .characteristicsValue[1].value;
        idWHS_SO = body.id[1].value;
        //console.log(idbuildingId)
        //console.log(idWHS_SO)
      });

      await test.step("serviceFeasibility", async () => {
        const requestBody = await checkL3(idbuildingId, idWHS_SO);

        const response = await request.post(`/serviceFeasibilityAPI/v2/serviceFeasibility/check`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 200);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
      });

      await test.step("Get LocationFlatId", async () => {
        const { body: requestBody, headers } = await getLocationFlatList("1026629", "WHS_SO_08000003530");
  
        const response = await request.post(`https://v4tibco-int.vfcz.dc-ratingen.de:12096/WhsApiResource`, {
          data: requestBody,
          headers: headers,
        });
  
        const body = await response.text();
        const parsedXml = await parseXml(body);
        const locationFlatIds = getLocationFlatIdsWithCondition(parsedXml);
        idlocationFlatId = getRandomElement(locationFlatIds);
      });

      await test.step("Info about selected locationFlatid", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "WaitForRealization", idWHS_SO);
        expect(checkForNullValues(body)).toBe(false);
        //console.log(JSON.stringify(body, null, 2));
      });

      await test.step("Info about selected locationFlatid #2", async () => {
        const requestBody = await serviceOrderL3(idlocationFlatId);

        const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 200);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        console.log(JSON.stringify(body, null, 2));
      });

      await test.step("Details required for provisioning", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        IndexOfWHSHWONT = findIndexOfSpecificValue(body, "WHSHWONT");
        //console.log(JSON.stringify(body, null, 2));
      });

      await test.step("Details required for provisioning #2", async () => {
        const requestBody = await serviceOrderL3Provisioning(IndexOfWHSHWONT);

        const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 200);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        console.log(JSON.stringify(body, null, 2));
        //console.log();
      });

      await test.step("Info about selected locationFlatid", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);
  
        await checkResponseStatus(response, 200);
  
        const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO, 7, 60000);
        expect(checkForNullValues(body)).toBe(false);
        //console.log(JSON.stringify(body, null, 2));
      });

      await test.step("WHS Partner requests provisioning start", async () => {
        const requestBody = await serviceOrderClosed();
  
        const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
          data: requestBody,
        });
  
        await checkResponseStatus(response, 200);
  
        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        //console.log(JSON.stringify(body, null, 2));
        //await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
      });
    });
  });
});