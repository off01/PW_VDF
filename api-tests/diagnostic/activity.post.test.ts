import { test, expect } from "@playwright/test"; // eslint-disable-line
import { checkResponseStatus } from "@helper/expectsAsserts";
import { diagnosticL3, diagnosticL3InvalidwhsServiceId } from "@datafactory/diagnostic";

test.describe("diagnostika test L3", async () => {
  test("odeslání requestu pro zjistění diagnostiky L3", async ({ request }) => {
    const requestBody = await diagnosticL3();

    const response = await request.post("/activityAPI/activity", {
      data: requestBody,
    });

    await checkResponseStatus(response, 200);

    //const body = await response.json();
    //console.log(JSON.stringify(body, null, 2));
  });

  test("odeslání nevalidního requestu pro zjistění diagnostiky L3", async ({ request }) => {
    const requestBody = await diagnosticL3InvalidwhsServiceId();

    const response = await request.post("/activityAPI/activity", {
      data: requestBody,
    });

    await checkResponseStatus(response, 400);

    //const body = await response.json();
    //console.log(JSON.stringify(body, null, 2));
  });
});
