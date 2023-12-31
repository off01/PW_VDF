import { test, expect } from "@playwright/test";
import { serviceOrderCancel } from "@datafactory/serviceOrder";
import { checkResponseStatus, checkForNullValues, validateJsonSchema } from "@helper/expectsAsserts";
import { fetchOrderId } from "@helper/dbQuerries";
import { findIndexOfSpecificValue } from "@helper/findIndex";

test.describe("Cancel L3", async () => {
  test("WHS Partner cancels ServiceOrder L3", async ({ request }) => {
    const idWHS_SO = await fetchOrderId("New","WHSFTTHCONN");
    if (!idWHS_SO) {
      throw new Error("Failed to fetch idWHS_SO from the database.");
    }

    let IndexOfWHSFTTHCONN: number;

    await test.step("GET with valid WHS_SO", async () => {
      const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

      await checkResponseStatus(response, 200);

      const body = await response.json();
      expect(checkForNullValues(body)).toBe(false);
      IndexOfWHSFTTHCONN = findIndexOfSpecificValue(body, "WHSFTTHCONN");
      await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
    });

    await test.step("PATCH with valid WHS_SO", async () => {
      const requestBody = await serviceOrderCancel(IndexOfWHSFTTHCONN);

      const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
        data: requestBody,
      });

      await checkResponseStatus(response, 200);

      const body = await response.json();
      expect(checkForNullValues(body)).toBe(false);
      console.log(idWHS_SO);
      await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
    });
  });
});

test.describe("Cancel L1", async () => {
  test("WHS Partner cancels ServiceOrder L1", async ({ request }) => {
    const idWHS_SO = await fetchOrderId("New","WHSHFCCONN");
    if (!idWHS_SO) {
      throw new Error("Failed to fetch idWHS_SO from the database.");
    }

    let IndexOfWHSHFCCONN: number;

    await test.step("GET with valid WHS_SO", async () => {
      const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

      await checkResponseStatus(response, 200);

      const body = await response.json();
      IndexOfWHSHFCCONN = findIndexOfSpecificValue(body, "WHSHFCCONN");
      await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
    });

    await test.step("PATCH with valid WHS_SO", async () => {
      const requestBody = await serviceOrderCancel(IndexOfWHSHFCCONN);

      const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
        data: requestBody,
      });

      await checkResponseStatus(response, 200);

      const body = await response.json();
      console.log(JSON.stringify(body, null, 2));
      console.log(idWHS_SO);
      await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
    });
  });
});
