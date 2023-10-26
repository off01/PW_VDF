import { test, expect } from "@playwright/test"
import { serviceOrderClosed } from "../../lib/datafactory/serviceOrder"
import { checkResponseStatus } from "../../lib/helper/expectsAsserts";
import { waitForExpectedStatus } from "../../lib/helper/waitingStatus";
import * as fs from 'fs';

const testCases = JSON.parse(fs.readFileSync('results/results.json', 'utf8'));

test.describe("Closure",async () => {
    testCases.forEach(testCase => {
        const idWHS_SO = testCase.idWHS_SO;
        test(`Uzavření aktivace pro ${idWHS_SO}`, async ({ request }) => {
            await test.step("Ask for status", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                await checkResponseStatus(response, 200);

                const body = await waitForExpectedStatus(request, "InstallationDone", idWHS_SO);
                console.log(JSON.stringify(body, null, 2));
            })
            
            await test.step("WHS Partner requests provisioning start", async () => {
                let requestBody = await serviceOrderClosed();

                const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                    data: requestBody
                });
                
                await checkResponseStatus(response, 200);

                const body = await response.json();
                console.log(JSON.stringify(body, null, 2));
            })
        });
    });
});