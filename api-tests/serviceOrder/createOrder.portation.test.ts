import { test, expect } from "@playwright/test"
import { createPortationL1OrderBody, createPortationL3OrderBody } from "../../lib/datafactory/createOrder"
import { serviceOrderL1Provisioning, serviceOrderL3Provisioning, serviceOrderClosed } from "../../lib/datafactory/serviceOrder";
import { waitForExpectedStatus } from "../../lib/helper/waitingStatus";
import { generateMacAddress } from "../../lib/helper/randomGenerator";
import { findIndexOfWHSHWONT } from "../../lib/helper/findIndex";
import { checkResponseStatus } from "../../lib/helper/expectsAsserts";
import { fetchOrderIdPortationMopIdL1, fetchOrderIdPortationMopIdL3 } from "../../lib/helper/dbQuerries";
import * as fs from 'fs';

const L1config = JSON.parse(fs.readFileSync('config/dataL1.json', 'utf8'));

test.describe("Portace L1",async () => {
    L1config.testConfigs.forEach(config => {
        test(`Portační objednávka pro ${config.tariff} L1 s hardware typem ${config.hardwareType}`, async ({ request }) => {
            const mopid = await fetchOrderIdPortationMopIdL1();
            if (!mopid) {
                throw new Error("Failed to fetch idWHS_SO from the database.");
            }
            let idWHS_SO: string;
            
            await test.step("Create", async () => {
                let requestBody = await createPortationL1OrderBody(mopid, config.tariff, config.hardwareType);

                const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
                    data: requestBody
                });
                
                await checkResponseStatus(response, 201);

                const body = await response.json();
                //console.log(JSON.stringify(body, null, 2));
                idWHS_SO = body.id[1].value;
                console.log(idWHS_SO)
            })    

            await test.step("Ask for status", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                await checkResponseStatus(response, 200);

                const body = await waitForExpectedStatus(request, "NoAppointment", idWHS_SO, 10, 5000);
                //console.log(JSON.stringify(body, null, 2));
            })
            
            await test.step("WHS Partner requests provisioning start", async () => {
                const macAddress = generateMacAddress()
                let requestBody = await serviceOrderL1Provisioning(macAddress);

                const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                    data: requestBody
                });

                await checkResponseStatus(response, 200);

                const body = await response.json();
                //console.log(JSON.stringify(body, null, 2));
            })

            await test.step("Ask for status", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                await checkResponseStatus(response, 200);

                const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO);
                //console.log(JSON.stringify(body, null, 2));
            })

            await test.step("Close", async () => {
                let requestBody = await serviceOrderClosed();

                const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                    data: requestBody
                });

                await checkResponseStatus(response, 200);
                
                const body = await response.json();
                //console.log(JSON.stringify(body, null, 2));
            })
        });
    });
});

const L3config = JSON.parse(fs.readFileSync('config/dataL3.json', 'utf8'));

test.describe("Portace L3",async () => {
    L3config.testConfigs.forEach(config => {
        test(`Portační objednávka pro ${config.tariff} L3 s hardware typem ${config.hardwareType}`, async ({ request }) => {
            const mopid = await fetchOrderIdPortationMopIdL3();
            if (!mopid) {
                throw new Error("Failed to fetch idWHS_SO from the database.");
            }
            let idWHS_SO: string;
            let IndexOfWHSHWONT: number;
            
            await test.step("Create", async () => {
                let requestBody = await createPortationL3OrderBody(mopid, config.tariff, config.hardwareType);

                const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
                    data: requestBody
                });
                expect(response.status()).toBe(201);
                const body = await response.json();
                //console.log(JSON.stringify(body, null, 2));
                idWHS_SO = body.id[1].value;
                console.log(idWHS_SO)
            })    

            await test.step("Details required for provisioning", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                expect(response.status()).toBe(200);
                const body = await waitForExpectedStatus(request, "WaitForRealization", idWHS_SO, 10, 5000);
                IndexOfWHSHWONT = findIndexOfWHSHWONT(body);
                //console.log(JSON.stringify(body, null, 2));
            })
            
            await test.step("WHS Partner requests provisioning start", async () => {
                let requestBody = await serviceOrderL3Provisioning(IndexOfWHSHWONT);

                const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                    data: requestBody
                });
                expect(response.status()).toBe(200);
                const body = await response.json();
                //console.log(JSON.stringify(body, null, 2));
            })

            await test.step("Ask for status", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                expect(response.status()).toBe(200);
                const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO, 60, 5000);
                //console.log(JSON.stringify(body, null, 2));
            })

            await test.step("Close", async () => {
                let requestBody = await serviceOrderClosed();

                const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                    data: requestBody
                });
                expect(response.status()).toBe(200);
                const body = await response.json();
                //console.log(JSON.stringify(body, null, 2));
            })
        });
    });
});