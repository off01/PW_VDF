import { test, expect } from "@playwright/test";
import { createPortationL1OrderBody, createPortationL3OrderBody } from "@datafactory/createOrder";
import { serviceOrderL1Provisioning, serviceOrderL3Provisioning, serviceOrderClosed } from "@datafactory/serviceOrder";
import { waitForExpectedStatus } from "@helper/waitingStatus";
import { generateMacAddress } from "@helper/randomGenerator";
import { findIndexOfSpecificValue } from "@helper/findIndex";
import { checkResponseStatus, checkForNullValues, validateJsonSchema } from "@helper/expectsAsserts";
import { fetchOrderIdPortationMopId } from "@helper/dbQuerries";
import * as fs from "fs";

const L1config = JSON.parse(fs.readFileSync("config/dataL1.json", "utf8"));

test.describe("Portace L1", async () => {
  L1config.testConfigs.forEach((config) => {
    test(`Portační objednávka pro ${config.tariff} L1 s hardware typem ${config.hardwareType}`, async ({ request }) => {
      /*       const mopid = await fetchOrderIdPortationMopId("VFHFC%");
      if (!mopid) {
        throw new Error("Failed to fetch idWHS_SO from the database.");
      } */

      const mopid = "VFHFC800000047638";

      let idWHS_SO: string;

      await test.step("Create", async () => {
        const requestBody = await createPortationL1OrderBody(mopid, config.tariff, config.hardwareType);

        const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 201);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        idWHS_SO = body.id[1].value;
        console.log(idWHS_SO);
        await validateJsonSchema("POST_serviceOrder", "ServiceOrder", body);
      });

      await test.step("Ask for status", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "NoAppointment", idWHS_SO, 15, 5000);
        expect(checkForNullValues(body)).toBe(false);
        await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("WHS Partner requests provisioning start", async () => {
        const macAddress = generateMacAddress();
        const requestBody = await serviceOrderL1Provisioning(macAddress);

        const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 200);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("Ask for status", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO, 60, 5000);
        expect(checkForNullValues(body)).toBe(false);
        await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("Close", async () => {
        const requestBody = await serviceOrderClosed();

        const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 200);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
      });
    });
  });
});

const L3config = JSON.parse(fs.readFileSync("config/dataL3.json", "utf8"));

test.describe("Portace L3", async () => {
  L3config.testConfigs.forEach((config) => {
    // skip z důvodu, že data jsou nataženy z db a pro účely portace musí být specifická adresa
    test.skip(`Portační objednávka pro ${config.tariff} L3 s hardware typem ${config.hardwareType}`, async ({
      request,
    }) => {
      const mopid = await fetchOrderIdPortationMopId("VFFTH%");
      if (!mopid) {
        throw new Error("Failed to fetch idWHS_SO from the database.");
      }
      let idWHS_SO: string;
      let IndexOfWHSHWONT: number;

      await test.step("Create", async () => {
        const requestBody = await createPortationL3OrderBody(mopid, config.tariff, config.hardwareType);

        const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 201);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        idWHS_SO = body.id[1].value;
        console.log(idWHS_SO);
        await validateJsonSchema("POST_serviceOrder", "ServiceOrder", body);
      });

      await test.step("Details required for provisioning", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "WaitForRealization", idWHS_SO, 15, 5000);
        expect(checkForNullValues(body)).toBe(false);
        IndexOfWHSHWONT = findIndexOfSpecificValue(body, "WHSHWONT");
        await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("WHS Partner requests provisioning start", async () => {
        const requestBody = await serviceOrderL3Provisioning(IndexOfWHSHWONT);

        const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 200);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("Ask for status", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO, 60, 5000);
        expect(checkForNullValues(body)).toBe(false);
        await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("Close", async () => {
        const requestBody = await serviceOrderClosed();

        const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 200);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
      });
    });
  });
});
