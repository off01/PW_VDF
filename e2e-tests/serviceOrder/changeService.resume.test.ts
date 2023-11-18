import { test, expect } from "@playwright/test";
import { serviceResume } from "@datafactory/customerServiceInventoryItem";
import { checkResponseStatus, checkForNullValues, validateJsonSchema } from "@helper/expectsAsserts";
import { fetchAssetId } from "@helper/dbQuerries";

test.describe("Resume L1", async () => {
  test("Obnovení suspendovaného assetu", async ({ request }) => {
    const idASSET_sub = await fetchAssetId("Suspend", "WHSHFCCONN");
    if (!idASSET_sub) {
      throw new Error("Failed to fetch idWHS_SO from the database.");
    }

    await test.step("WHS Partner requests provisioning start", async () => {
      const requestBody = await serviceResume();

      const response = await request.patch(
        `/customerServiceInventoryItemAPI/v2/customerServiceInventoryItem/${idASSET_sub}`,
        {
          data: requestBody,
        }
      );

      await checkResponseStatus(response, 200);

      const body = await response.json();
      expect(checkForNullValues(body)).toBe(false);
      //console.log(JSON.stringify(body, null, 2));
      await validateJsonSchema("PATCH_CustomerServiceInventoryItem_{id}", "CustomerServiceInventoryItem", body);
    });
  });
});
