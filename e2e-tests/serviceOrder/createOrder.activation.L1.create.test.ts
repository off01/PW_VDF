import { test, expect } from "@playwright/test";
import { createActivationL1OrderBody } from "@datafactory/createOrder";
import { questionaryL1 } from "@datafactory/partyFeedback";
import { customerAppointmentL1 } from "@datafactory/customerAppointment";
import { getRandomElement, extractWHSWAS } from "@helper/listofflats";
import { waitForExpectedStatus } from "@helper/waitingStatus";
import { getTomorrowDate } from "@helper/timeGenerator";
import { recordResults } from "@helper/fileOperations";
import { checkResponseStatus, checkForNullValues, validateJsonSchema } from "@helper/expectsAsserts";
import { choosehwProfile } from "@helper/randomGenerator"
import * as fs from "fs";

const L1config = JSON.parse(fs.readFileSync("config/dataL1.json", "utf8"));

test.describe(`Aktivace test L1 spolu s HW`, async () => {
  L1config.testConfigs.forEach((config) => {
    test(`Aktivační objednávka pro ${config.tariff} L1 s hardware typem ${config.hardwareType}`, async ({
      request,
    }) => {
      let idWHS_SO = "";
      let idWHS_PFS: string;
      let idWHS_WAS: string;
      let idWHS_PF: string; // eslint-disable-line
      let idASSET_ser = "";
      let hwProfile: string;
      let hwType: string; // eslint-disable-line

      await test.step("Create", async () => {
        const requestBody = await createActivationL1OrderBody(config.tariff, config.hardwareType);

        const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 201);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        idWHS_SO = body.id[1].value;
        idASSET_ser = body.parts.lineItem[1].serviceSpecification[0].characteristicsValue[0].value;
        hwProfile = choosehwProfile(config.hardwareType);
        hwType = config.hardwareType;
        console.log(hwProfile)
        console.log(idWHS_SO)

        await validateJsonSchema("POST_serviceOrder", "ServiceOrder", body);
      });

      await test.step("Ask for status QuestionsReady", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "QuestionsReady", idWHS_SO, 25, 5000);
        expect(checkForNullValues(body)).toBe(false);
        await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("Details required for provisioning", async () => {
        const response = await request.get(
          `/partyFeedbackSpecificationAPI/partyFeedbackSpecification?relatedObjectId=${idWHS_SO}`
        );

        await checkResponseStatus(response, 200);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        idWHS_PFS = body[0].ids[0].value;

        await validateJsonSchema("GET_partyFeedbackSpecification", "PartyFeedbackSpecification", body);
      });

      await test.step("Create", async () => {
        const requestBody = await questionaryL1(idWHS_PFS, idWHS_SO);

        const response = await request.post(`/partyFeedbackAPI/partyFeedback`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 201);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        idWHS_PF = body.id[1].value;

        await validateJsonSchema("POST_partyFeedback", "PartyFeedback", body);
      });

      await test.step("Ask for status QuestionsReady", async () => {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

        await checkResponseStatus(response, 200);

        const body = await waitForExpectedStatus(request, "AppointmentRequired", idWHS_SO);
        expect(checkForNullValues(body)).toBe(false);
        await validateJsonSchema("GET_serviceOrder_{id}", "ServiceOrder", body);
      });

      await test.step("Ask for status QuestionsReady", async () => {
        const tomorrowDate = await getTomorrowDate();
        const response = await request.get(
          `/WorkforceAppointmentSlotAPI/workforceAppointmentSlot?fromDate=${tomorrowDate}T06:00:00.000%2B01:00&relatedObjectId=${idWHS_SO}&type=Installation`
        );

        await checkResponseStatus(response, 200);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        const whs_was_ids = extractWHSWAS(body);
        idWHS_WAS = getRandomElement(whs_was_ids);

        await validateJsonSchema("GET_workforceAppointmentSlot", "WorkforceAppointmentSlot", body);
      });

      await test.step("Create", async () => {
        const requestBody = await customerAppointmentL1(idWHS_WAS);

        const response = await request.post(`/customerAppointmentAPI/v2/customerAppointment`, {
          data: requestBody,
        });

        await checkResponseStatus(response, 201);

        const body = await response.json();
        expect(checkForNullValues(body)).toBe(false);
        console.log(idWHS_SO, idASSET_ser);

        await validateJsonSchema("POST_customerAppointment", "CustomerAppointment", body);
      });
      await recordResults(idWHS_SO, idASSET_ser, hwProfile);
    });
  });
});
