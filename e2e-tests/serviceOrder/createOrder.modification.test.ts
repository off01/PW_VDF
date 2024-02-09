import { test, expect } from "@playwright/test";
import {
  createModificationChangeTariffL1OrderBody,
  createModificationSwapHWL1OrderBody,
  createModificationSwapHWL3OrderBody,
} from "@datafactory/createOrder";
import {
  serviceOrderL3Provisioning,
  serviceOrderClosed,
  TEMPserviceOrderL1Provisioning,
  serviceOrderProvisioning,
  serviceOrderFFModification
} from "@datafactory/serviceOrder";
import { waitForExpectedStatus } from "@helper/waitingStatus";
import { generateMacAddress } from "@helper/randomGenerator";
import { findIndexOfSpecificValue } from "@helper/findIndex";
import { checkResponseStatus, checkForNullValues, validateJsonSchema } from "@helper/expectsAsserts";
import { fetchDataModification, fetchOrderIdFF } from "@helper/dbQuerries";
import { choosehwProfile } from "@helper/randomGenerator"
import * as fs from "fs";

const L3config = JSON.parse(fs.readFileSync("config/dataL3.json", "utf8"));

test.describe("Modifikace L3 - SWAP HW", async () => {
  L3config.hardwarePairs.forEach((pair) => {
    test(`Změna HW z ${pair.original} na ${pair.new} pro L3`, async ({ request }) => {
      const data = await fetchDataModification(pair.original);
      if (!data) {
        throw new Error("Failed to fetch idWHS_SO from the database.");
      }

      const idASSET_sub = data.WHS_ASSET_ID1;
      const idASSET_ser = data.WHS_ASSET_ID2;
      const idASSET_ass1 = data.WHS_ASSET_ID3;
      const idASSET_ass2 = data.WHS_ASSET_ID4;
      const WHSDATA = data.Tarif;
      const randomrsnNumber_OG = data.snNumber;
      const randomrid_OG = data.rid;
      const WHSHW_OG = data.HW; 
      const hwProfile_OG = data.hwProfile;
      let idWHS_SO: string;
      let IndexOfWHSHW: number;
      let hwProfile: string;
      let hwType: string; // eslint-disable-line
      

      await test.step("Create", async () => {
        const requestBody = await createModificationSwapHWL3OrderBody(
          idASSET_sub,
          idASSET_ser,
          WHSDATA,
          idASSET_ass1,
          WHSHW_OG,
          idASSET_ass2,
          randomrsnNumber_OG,
          randomrid_OG,
          hwProfile_OG,
          pair.new
        );

        const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 201);

        const body = await response.json();
        //console.log(JSON.stringify(body, null, 2));
        idWHS_SO = body.id[1].value;
        console.log(idWHS_SO);
        hwProfile = choosehwProfile(pair.new);
        hwType = pair.new;
        await validateJsonSchema("POST_serviceOrder", "ServiceOrder", body);
      });

      await test.step("Ask for status NoAppointment", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "WaitForRealization", idWHS_SO, 20, 5000);
        IndexOfWHSHW = findIndexOfSpecificValue(body, WHSHW_OG);
        //console.log(JSON.stringify(body, null, 2));
        await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("Details required for provisioning #2", async () => {
        const requestBody = await serviceOrderL3Provisioning(IndexOfWHSHW, hwProfile);

        const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 200);

        const body = await response.json();
        console.log(JSON.stringify(body, null, 2));
        //console.log();
        await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("Ask for status NoAppointment", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO, 7, 60000);
        console.log(JSON.stringify(body, null, 2));
        await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("Close", async () => {
        const requestBody = await serviceOrderClosed();

        const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 200);

        const body = await response.json();
        //console.log(JSON.stringify(body, null, 2));
        await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
      });
    });
  });
});

const L1config = JSON.parse(fs.readFileSync("config/dataL1.json", "utf8"));

test.describe("Modifikace L1 - SWAP HW", async () => {
  L1config.hardwarePairs.forEach((pair) => {
    test(`Změna HW z ${pair.original} na ${pair.new} pro L1`, async ({ request }) => {
      const data = await fetchDataModification(pair.original);
      if (!data) {
        throw new Error("Failed to fetch idWHS_SO from the database.");
      }

      const idASSET_sub = data.WHS_ASSET_ID1;
      const idASSET_ser = data.WHS_ASSET_ID2;
      const idASSET_ass1 = data.WHS_ASSET_ID3;
      const idASSET_ass2 = data.WHS_ASSET_ID4;
      const WHSDATA = data.Tarif;
      const macAddress = data.macAddress;
      const WHSHW_OG = data.HW;
      const hwProfile_OG = data.hwProfile;
      let idWHS_SO: string;
      let hwProfile: string;
      let hwType: string; // eslint-disable-line

      await test.step("Create", async () => {
        const requestBody = await createModificationSwapHWL1OrderBody(
          idASSET_sub,
          idASSET_ser,
          WHSDATA,
          idASSET_ass1,
          WHSHW_OG,
          idASSET_ass2,
          macAddress,
          hwProfile_OG,
          pair.new
        );

        const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 201);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        //console.log(JSON.stringify(body, null, 2));
        idWHS_SO = body.id[1].value;
        console.log(idWHS_SO); //Výpis do konzole č.obj
        hwProfile = choosehwProfile(pair.new);
        console.log(hwProfile); //Výpis do konzole budoucí hwProfile 
        hwType = pair.new;
        await validateJsonSchema("POST_serviceOrder", "ServiceOrder", body);
      });

      await test.step("Ask for status NoAppointment", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "NoAppointment", idWHS_SO, 10, 5000);
        expect(checkForNullValues(body)).toBe(false);
        //console.log(JSON.stringify(body, null, 2));
        await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("WHS Partner requests provisioning start", async () => {
        const macAddress = generateMacAddress();
        const requestBody = await TEMPserviceOrderL1Provisioning(macAddress, hwProfile);

        const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 200);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        //console.log(JSON.stringify(body, null, 2));
        await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("Ask for status NoAppointment", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO, 10, 5000);
        expect(checkForNullValues(body)).toBe(false);
        //console.log(JSON.stringify(body, null, 2));
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
        //console.log(JSON.stringify(body, null, 2));
        await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
      });
    });
  });
});

test.describe("Modifikace L1 - Změna tarifu", async () => {
  L1config.allowedCombinationForChange.forEach((config) => {
    test(`Změna z tarifu ${config.originalTariff} na tarif ${config.newTariff} s HW typu ${config.originalHW}`, async ({
      request,
    }) => {
      const data = await fetchDataModification(config.originalHW, config.originalTariff);
      if (!data) {
        throw new Error("Failed to fetch idWHS_SO from the database.");
      }

      const idASSET_sub = data.WHS_ASSET_ID1;
      const idASSET_ser = data.WHS_ASSET_ID2;
      const idASSET_ass1 = data.WHS_ASSET_ID3;
      const idASSET_ass2 = data.WHS_ASSET_ID4;
      const WHSDATA = data.Tarif;
      const macAddress = data.macAddress;
      const WHSHW_OG = data.HW;
      let idWHS_SO: string;

      await test.step("Create", async () => {
        const requestBody = await createModificationChangeTariffL1OrderBody(
          idASSET_sub,
          idASSET_ser,
          WHSDATA,
          idASSET_ass1,
          WHSHW_OG,
          idASSET_ass2,
          macAddress,
          config.newTariff
        );

        const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 201);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        //console.log(JSON.stringify(body, null, 2));
        idWHS_SO = body.id[1].value;
        console.log(idWHS_SO);
        await validateJsonSchema("POST_serviceOrder", "ServiceOrder", body);
      });

      await test.step("Ask for status", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "NoAppointment", idWHS_SO, 60, 5000);
        expect(checkForNullValues(body)).toBe(false);
        //console.log(JSON.stringify(body, null, 2));
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
        //console.log(JSON.stringify(body, null, 2));
        await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("Ask for status", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO, 60, 5000);
        expect(checkForNullValues(body)).toBe(false);
        //console.log(JSON.stringify(body, null, 2));
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
        //console.log(JSON.stringify(body, null, 2));
        await validateJsonSchema("PATCH_serviceOrder_{id}", "ServiceOrder", body);
      });
    });
  });
});

test.describe("Modifikace FF - Změna fiberu", async () => {
  test("Modifikační objednávka FF - Schválená", async ({ request }) => {
    const idWHS_SOdata = await fetchOrderIdFF("Active", "WHSFTTHFLEXI");
    if (!idWHS_SOdata) {
      throw new Error("Failed to fetch DATA from the database.");
    }
    let whsAssetId: string;
    let whsAssetId_1: string;
    let whsAssetId_2: string;
    let whsAssetId_3: string;
    let whsAssetId_4: string;
    let whsAssetId_5: string;
    let ffServiceId: string;
    let fiberSegmentID_1: string;
    let fiberSegmentID_2: string;
    let idWHS_SO: string;

    await test.step("Get data for modification order", async () => {
      const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SOdata}`);

      await checkResponseStatus(response, 200);

      const body = await response.json();
      whsAssetId = body.parts.lineItem[0].serviceSpecification[0].characteristicsValue[0].value;
      whsAssetId_1 = body.parts.lineItem[1].serviceSpecification[0].characteristicsValue[0].value;
      whsAssetId_2 = body.parts.lineItem[2].serviceSpecification[0].characteristicsValue[0].value;	
      whsAssetId_3 = body.parts.lineItem[3].serviceSpecification[0].characteristicsValue[0].value;
      whsAssetId_4 = body.parts.lineItem[4].serviceSpecification[0].characteristicsValue[0].value;
      whsAssetId_5 = body.parts.lineItem[5].serviceSpecification[0].characteristicsValue[0].value;
      ffServiceId = body.parts.lineItem[0].serviceSpecification[0].characteristicsValue[1].value;
      fiberSegmentID_1 = body.parts.lineItem[4].serviceSpecification[0].characteristicsValue[1].value;
      fiberSegmentID_2 = body.parts.lineItem[5].serviceSpecification[0].characteristicsValue[1].value;
    });

    await test.step("Create", async () => {
      const requestBody = await serviceOrderFFModification("AUTO-APPROVE", whsAssetId, whsAssetId_1, whsAssetId_2, whsAssetId_3, whsAssetId_4, whsAssetId_5, ffServiceId, fiberSegmentID_1, fiberSegmentID_2);

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

  test("Modifikační objednávka FF - Neschválená", async ({ request }) => {
    const idWHS_SOdata = await fetchOrderIdFF("Active", "WHSFTTHFLEXI");
    if (!idWHS_SOdata) {
      throw new Error("Failed to fetch DATA from the database.");
    }
    let whsAssetId: string;
    let whsAssetId_1: string;
    let whsAssetId_2: string;
    let whsAssetId_3: string;
    let whsAssetId_4: string;
    let whsAssetId_5: string;
    let ffServiceId: string;
    let fiberSegmentID_1: string;
    let fiberSegmentID_2: string;
    let idWHS_SO: string;

    await test.step("Get data for modification order", async () => {
      const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SOdata}`);

      await checkResponseStatus(response, 200);

      const body = await response.json();
      whsAssetId = body.parts.lineItem[0].serviceSpecification[0].characteristicsValue[0].value;
      whsAssetId_1 = body.parts.lineItem[1].serviceSpecification[0].characteristicsValue[0].value;
      whsAssetId_2 = body.parts.lineItem[2].serviceSpecification[0].characteristicsValue[0].value;	
      whsAssetId_3 = body.parts.lineItem[3].serviceSpecification[0].characteristicsValue[0].value;
      whsAssetId_4 = body.parts.lineItem[4].serviceSpecification[0].characteristicsValue[0].value;
      whsAssetId_5 = body.parts.lineItem[5].serviceSpecification[0].characteristicsValue[0].value;
      ffServiceId = body.parts.lineItem[0].serviceSpecification[0].characteristicsValue[1].value;
      fiberSegmentID_1 = body.parts.lineItem[4].serviceSpecification[0].characteristicsValue[1].value;
      fiberSegmentID_2 = body.parts.lineItem[5].serviceSpecification[0].characteristicsValue[1].value;
    });

    await test.step("Create", async () => {
      const requestBody = await serviceOrderFFModification("AUTO-REJECT", whsAssetId, whsAssetId_1, whsAssetId_2, whsAssetId_3, whsAssetId_4, whsAssetId_5, ffServiceId, fiberSegmentID_1, fiberSegmentID_2);

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

  test("Modifikační objednávka FF - Manuální zpracování - /*Pouze vytvoření*/", async ({ request }) => {
    const idWHS_SOdata = await fetchOrderIdFF("Active", "WHSFTTHFLEXI");
    if (!idWHS_SOdata) {
      throw new Error("Failed to fetch DATA from the database.");
    }
    let whsAssetId: string;
    let whsAssetId_1: string;
    let whsAssetId_2: string;
    let whsAssetId_3: string;
    let whsAssetId_4: string;
    let whsAssetId_5: string;
    let ffServiceId: string;
    let fiberSegmentID_1: string;
    let fiberSegmentID_2: string;
    let idWHS_SO: string;

    await test.step("Get data for modification order", async () => {
      const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SOdata}`);

      await checkResponseStatus(response, 200);

      const body = await response.json();
      whsAssetId = body.parts.lineItem[0].serviceSpecification[0].characteristicsValue[0].value;
      whsAssetId_1 = body.parts.lineItem[1].serviceSpecification[0].characteristicsValue[0].value;
      whsAssetId_2 = body.parts.lineItem[2].serviceSpecification[0].characteristicsValue[0].value;	
      whsAssetId_3 = body.parts.lineItem[3].serviceSpecification[0].characteristicsValue[0].value;
      whsAssetId_4 = body.parts.lineItem[4].serviceSpecification[0].characteristicsValue[0].value;
      whsAssetId_5 = body.parts.lineItem[5].serviceSpecification[0].characteristicsValue[0].value;
      ffServiceId = body.parts.lineItem[0].serviceSpecification[0].characteristicsValue[1].value;
      fiberSegmentID_1 = body.parts.lineItem[4].serviceSpecification[0].characteristicsValue[1].value;
      fiberSegmentID_2 = body.parts.lineItem[5].serviceSpecification[0].characteristicsValue[1].value;
    });

    await test.step("Vytvoření modifikační objednávky - s manuálním zásahem", async () => {
      const requestBody = await serviceOrderFFModification("Manuální zásah", whsAssetId, whsAssetId_1, whsAssetId_2, whsAssetId_3, whsAssetId_4, whsAssetId_5, ffServiceId, fiberSegmentID_1, fiberSegmentID_2);

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

