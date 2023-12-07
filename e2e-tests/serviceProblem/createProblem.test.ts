import { test, expect } from "@playwright/test";
import { checkResponseStatus, checkForNullValues, validateJsonSchema } from "@helper/expectsAsserts";
//import { fetchAssetId } from "@helper/dbQuerries";
import { createServisProblemOrderBody } from "@datafactory/servisProblem";

test.describe("Vytvoření SP WHS", async () => {
  test("POST with valid idASSET_ser", async ({ request }) => {
    /*     const idASSET_sub = await fetchAssetId("Active", "WHSFTTHCONN");
    if (!idASSET_sub) {
      throw new Error("Failed to fetch DATA from the database.");
    } */

    const idASSET_ser = "1081002655";

    let idWHS_SP_TT: string;
    let idTroubleTicket: string;

    await test.step("POST with valid ServiceId", async () => {
      const requestBody = await createServisProblemOrderBody(idASSET_ser, "SupportRequired");

      const response = await request.post(`/serviceProblemAPI/v2/serviceProblem`, {
        data: requestBody,
      });

      await checkResponseStatus(response, 201);

      const body = await response.json();
      expect(checkForNullValues(body)).toBe(false);
      idWHS_SP_TT = body.id[1].value;
      idTroubleTicket = body.parts.incident[0].id[0].value;
      console.log(idASSET_ser);
      console.log(idWHS_SP_TT);
      console.log(idTroubleTicket);
      await validateJsonSchema("POST_serviceProblem", "ServiceProblem", body);
    });
  });

  test("POST with invalid idASSET_ser", async ({ request }) => {
    const idASSET_ser = "1080002655"; // invalid idASSET_ser

    await test.step("POST with valid ServiceId", async () => {
      const requestBody = await createServisProblemOrderBody(idASSET_ser, "SupportRequired");

      const response = await request.post(`/serviceProblemAPI/v2/serviceProblem`, {
        data: requestBody,
      });

      await checkResponseStatus(response, 400);

      const body = await response.json();
      console.log(JSON.stringify(body, null, 2));
    });
  });

  test("POST with empty body", async ({ request }) => {
    const response = await request.post(`/serviceProblemAPI/v2/serviceProblem`, {
      data: {},
    });

    await checkResponseStatus(response, 400);

    const body = await response.json();
    console.log(JSON.stringify(body, null, 2));
  });

  test("POST with no body", async ({ request }) => {
    const response = await request.post(`/serviceProblemAPI/v2/serviceProblem`, {});

    await checkResponseStatus(response, 400);

    const body = await response.json();
    console.log(JSON.stringify(body, null, 2));
  });
});
