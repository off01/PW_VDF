import { test, expect } from "@playwright/test";
import { createTerminationL3OrderBody, createTerminationL1OrderBody } from "@datafactory/createOrder";
import { serviceOrderProvisioning, serviceOrderClosed, serviceOrderFFTermination } from "@datafactory/serviceOrder";
import { waitForExpectedStatus } from "@helper/waitingStatus";
import { checkResponseStatus, checkForNullValues, validateJsonSchema } from "@helper/expectsAsserts";
import { fetchAssetId, fetchOrderIdFF } from "@helper/dbQuerries";

test.describe("Terminace L3", async () => {
  test("Terminační objenávka pro L3", async ({ request }) => {
    const idASSET_sub = await fetchAssetId("Active", "WHSFTTHCONN");
    if (!idASSET_sub) {
      throw new Error("Failed to fetch DATA from the database.");
    }
    let idWHS_SO: string;

    await test.step("Create", async () => {
      const requestBody = await createTerminationL3OrderBody(idASSET_sub);

      const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
        data: requestBody,
      });

      await checkResponseStatus(response, 201);

      const body = await response.json();
      expect(checkForNullValues(body)).toBe(false);
      idWHS_SO = body.id[1].value;
      console.log(idASSET_sub);
      console.log(idWHS_SO);
      await validateJsonSchema("POST_serviceOrder", "ServiceOrder", body);
    });

    await test.step("Ask for status", async () => {
      const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

      await checkResponseStatus(response, 200);

      const body = await waitForExpectedStatus(request, "WaitForRealization", idWHS_SO, 20, 5000);
      expect(checkForNullValues(body)).toBe(false);
      await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
    });

    await test.step("WHS Partner requests provisioning start", async () => {
      const requestBody = await serviceOrderProvisioning();

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

      const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO, 20, 5000);
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

test.describe("Terminace L1", async () => {
  test("Terminační objenávka pro L1", async ({ request }) => {
    const idASSET_sub = await fetchAssetId("Active", "WHSHFCCONN");
    if (!idASSET_sub) {
      throw new Error("Failed to fetch DATA from the database.");
    }
    let idWHS_SO: string;

    await test.step("Create", async () => {
      const requestBody = await createTerminationL1OrderBody(idASSET_sub);

      const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
        data: requestBody,
      });

      await checkResponseStatus(response, 201);

      const body = await response.json();
      expect(checkForNullValues(body)).toBe(false);
      idWHS_SO = body.id[1].value;
      console.log(idASSET_sub);
      console.log(idWHS_SO);
      await validateJsonSchema("POST_serviceOrder", "ServiceOrder", body);
    });

    await test.step("Ask for status", async () => {
      const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

      await checkResponseStatus(response, 200);

      const body = await waitForExpectedStatus(request, "NoAppointment", idWHS_SO);
      expect(checkForNullValues(body)).toBe(false);
      await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
    });

    await test.step("WHS Partner requests provisioning start", async () => {
      const requestBody = await serviceOrderProvisioning();

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

      const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO);
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

test.describe("Terminace FF", async () => {
  test("Terminační objenávka pro FF - Schválená", async ({ request }) => {
    const idWHS_SOdata = await fetchOrderIdFF("Active", "WHSFTTHFLEXI");
    if (!idWHS_SOdata) {
      throw new Error("Failed to fetch DATA from the database.");
    }
    let whsAssetId: string;
    let ffServiceId: string;
    let idWHS_SO: string;

    await test.step("Get data for termination order", async () => {
      const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SOdata}`);

      await checkResponseStatus(response, 200);

      const body = await response.json();
      whsAssetId = body.parts.lineItem[0].serviceSpecification[0].characteristicsValue[0].value;
      ffServiceId = body.parts.lineItem[0].serviceSpecification[0].characteristicsValue[1].value;
    });

    await test.step("Create", async () => {
      const requestBody = await serviceOrderFFTermination("AUTO-TERMINATE", whsAssetId, ffServiceId);

      const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
        data: requestBody,
      });

      await checkResponseStatus(response, 201);

      const body = await response.json();
      expect(checkForNullValues(body)).toBe(false);
      idWHS_SO = body.id[1].value
      console.log(idWHS_SO);
      //await validateJsonSchema("POST_serviceOrder", "ServiceOrder", body);
    });

    await test.step("Ask for status", async () => {
      const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

      await checkResponseStatus(response, 200);

      const body = await waitForExpectedStatus(request, "Realized", idWHS_SO, 11, 60000);
      expect(checkForNullValues(body)).toBe(false);
      //await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
    });

    await test.step("Close", async () => {
      const requestBody = await serviceOrderClosed();

      const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
        data: requestBody,
      });

      await checkResponseStatus(response, 200);

      const body = await response.json();
      expect(checkForNullValues(body)).toBe(false);
      console.log(JSON.stringify(body, null, 2));
      //await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
    });
  });
  test("Terminační objenávka pro FF - Manuální zpracování - /*Pouze vytvoření*/", async ({ request }) => {
    const idWHS_SOdata = await fetchOrderIdFF("Active", "WHSFTTHFLEXI");
    if (!idWHS_SOdata) {
      throw new Error("Failed to fetch DATA from the database.");
    }
    let whsAssetId: string;
    let ffServiceId: string;
    let idWHS_SO: string;

    await test.step("Get data for termination order", async () => {
      const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SOdata}`);

      await checkResponseStatus(response, 200);

      const body = await response.json();
      whsAssetId = body.parts.lineItem[0].serviceSpecification[0].characteristicsValue[0].value;
      ffServiceId = body.parts.lineItem[0].serviceSpecification[0].characteristicsValue[1].value;
    });

    await test.step("Create", async () => {
      const requestBody = await serviceOrderFFTermination("Manuálání zpracování", whsAssetId, ffServiceId);

      const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
        data: requestBody,
      });

      await checkResponseStatus(response, 201);

      const body = await response.json();
      expect(checkForNullValues(body)).toBe(false);
      idWHS_SO = body.id[1].value
      console.log(idWHS_SO);
      //await validateJsonSchema("POST_serviceOrder", "ServiceOrder", body);
    });
  });
});

