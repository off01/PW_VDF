import { test, expect } from "@playwright/test";
import { serviceOrderFF } from "@datafactory/serviceOrder";
import { checkResponseStatus, checkForNullValues, validateJsonSchema } from "@helper/expectsAsserts";
import { waitForExpectedStatus } from "@helper/waitingStatus";
import { serviceOrderClosed } from "@datafactory/serviceOrder";

test.describe("Aktivace test FF", async () => {
  test(`Aktivační objednávka FF - Schválená`, async ({ request }) => {
    let idWHS_SO: string;

    await test.step("Create", async () => {
      const requestBody = await serviceOrderFF("AUTO-APPROVE");

      const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
        data: requestBody,
      });

      await checkResponseStatus(response, 201);

      const body = await response.json();
      expect(checkForNullValues(body)).toBe(false);
      //console.log(JSON.stringify(body, null, 2));
      idWHS_SO = body.id[1].value;
      //console.log(idbuildingId)
      console.log(idWHS_SO);
    });

    await test.step("Info about selected locationFlatid", async () => {
      const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

      await checkResponseStatus(response, 200);

      const body = await waitForExpectedStatus(request, "Realized", idWHS_SO, 11, 60000);
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

  test(`Aktivační objednávka FF - Neschválená`, async ({ request }) => {
    let idWHS_SO: string; // eslint-disable-line

    await test.step("Create", async () => {
      const requestBody = await serviceOrderFF("AUTO-REJECT");

      const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
        data: requestBody,
      });

      await checkResponseStatus(response, 201);

      const body = await response.json();
      expect(checkForNullValues(body)).toBe(false);
      //console.log(JSON.stringify(body, null, 2));
      idWHS_SO = body.id[1].value;
      //console.log(idbuildingId)
      //console.log(idWHS_SO)
    });

    await test.step("Info about selected locationFlatid", async () => {
      const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

      await checkResponseStatus(response, 200);

      const body = await waitForExpectedStatus(request, "InstallationNotFeasible", idWHS_SO, 11, 60000);
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
      console.log(JSON.stringify(body, null, 2));
      await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
    });
  });

  test(`Aktivační objednávka FF - Manuální zpracování`, async ({ request }) => {
    let idWHS_SO: string; // eslint-disable-line

    await test.step("Create", async () => {
      const requestBody = await serviceOrderFF("Manuální zpracování");

      const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
        data: requestBody,
      });

      await checkResponseStatus(response, 201);

      const body = await response.json();
      expect(checkForNullValues(body)).toBe(false);
      //console.log(JSON.stringify(body, null, 2));
      idWHS_SO = body.id[1].value;
      //console.log(idbuildingId)
      //console.log(idWHS_SO)
    });

    await test.step("Info about selected locationFlatid", async () => {
      const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

      await checkResponseStatus(response, 200);

      const body = await waitForExpectedStatus(request, "InstallationNotFeasible", idWHS_SO, 11, 60000);
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
      console.log(JSON.stringify(body, null, 2));
      await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
    });
  });
});
