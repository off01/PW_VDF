import { test, expect } from "@playwright/test"; // eslint-disable-line
import { checkResponseStatus, validateJsonSchema } from "@helper/expectsAsserts";
import { diagnosticL3 } from "@datafactory/diagnostic"; // eslint-disable-line

test.describe("Diagnostika WHS L3", async () => {
  test("POST with valid ServiceId", async ({ request }) => {
    const requestBody = await diagnosticL3("80016090");

    const response = await request.post("/activityAPI/activity", {
      data: requestBody,
    });

    await checkResponseStatus(response, 200);

    const body = await response.json();
    //console.log(JSON.stringify(body, null, 2));

    await validateJsonSchema("POST_activity", "Diagnostics", body); // await validateJsonSchema("POST_activity", "Diagnostics", body, true); - true v případě kdy chci nové schema vytvořit
  });

  test("POST with invalid ServiceId", async ({ request }) => {
    const requestBody = await diagnosticL3("354534");

    const response = await request.post("/activityAPI/activity", {
      data: requestBody,
    });

    await checkResponseStatus(response, 400);

    const body = await response.json();
    //console.log(JSON.stringify(body, null, 2));

    await validateJsonSchema("POST_activity", "Diagnostics", body); // await validateJsonSchema("POST_activity", "Diagnostics", body, true); - true v případě kdy chci nové schema vytvořit
    expect(body).toHaveProperty('description');
    expect(body).toHaveProperty('errorCode');
    expect(body.description[0].value).toBe('Related entity doesn’t exist');
    expect(body.errorCode[0].value).toBe('240');
  });
});
