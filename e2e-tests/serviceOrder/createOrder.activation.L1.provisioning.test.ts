import { test, expect } from "@playwright/test";
import { serviceOrderL1Provisioning } from "@datafactory/serviceOrder";
import { waitForExpectedStatus } from "@helper/waitingStatus";
import { generateMacAddress } from "@helper/randomGenerator";
import { checkResponseStatus, checkForNullValues, validateJsonSchema } from "@helper/expectsAsserts";
import * as fs from "fs";

const testCases = JSON.parse(fs.readFileSync("results/results.json", "utf8"));

test.describe("Provisioning", async () => {
  testCases.forEach((testCase) => {
    const idWHS_SO = testCase.idWHS_SO;
    const hwProfile = testCase.hwProfile;
    test(`Nahození HW pro ${idWHS_SO}`, async ({ request }) => {
      await test.step("Ask for status", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "Realized", idWHS_SO);
        expect(checkForNullValues(body)).toBe(false);
        console.log(JSON.stringify(body, null, 2));
        await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("WHS Partner requests provisioning start", async () => {
        const macAddress = generateMacAddress();
        const requestBody = await serviceOrderL1Provisioning(macAddress, hwProfile);

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
});
