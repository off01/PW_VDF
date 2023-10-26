import { test, expect } from "@playwright/test"
import { createActivationL1OrderBody } from "../../lib/datafactory/createOrder"
import { serviceOrderL1Provisioning } from "../../lib/datafactory/serviceOrder"
import { questionaryL1 } from "../../lib/datafactory/partyFeedback"
import { customerAppointmentL1 } from "../../lib/datafactory/customerAppointment"
import { getRandomElement, extractWHSWAS } from "../../lib/helper/listofflats";
import { waitForExpectedStatus } from "../../lib/helper/waitingStatus";
import { getTomorrowDate } from "../../lib/helper/timeGenerator";
import { recordResults, getTestCases } from "../../lib/helper/fileOperations";
import { generateMacAddress } from "../../lib/helper/randomGenerator";
import * as fs from 'fs';

const testCases = JSON.parse(fs.readFileSync('results/results.json', 'utf8'));

test.describe("Provisioning",async () => {
    testCases.forEach(testCase => {
        const idWHS_SO = testCase.idWHS_SO;
        test(`Nahození HW pro ${testCases.idWHS_SO}`, async ({ request }) => {
            await test.step("Ask for status", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                expect(response.status()).toBe(200);
                const body = await waitForExpectedStatus(request, "Realized", idWHS_SO);
                console.log(JSON.stringify(body, null, 2));
            })
            
            await test.step("WHS Partner requests provisioning start", async () => {
                const macAddress = generateMacAddress()
                let requestBody = await serviceOrderL1Provisioning(macAddress);

                const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                    data: requestBody
                });
                expect(response.status()).toBe(200);
                const body = await response.json();
                console.log(JSON.stringify(body, null, 2));
            })
        });
    });
});