import { test, expect } from "@playwright/test"
import { createModificationL3OrderBody, createModificationSwapHWL1OrderBody, createModificationSwapHWL3OrderBody } from "../../lib/datafactory/createOrder"
import { serviceOrderL3Provisioning, serviceOrderClosed, TEMPserviceOrderL1Provisioning } from "../../lib/datafactory/serviceOrder";
import { waitForExpectedStatus } from "../../lib/helper/waitingStatus";
import { generateMacAddress } from "../../lib/helper/randomGenerator";
import { findIndexOfWHSHWONT } from "../../lib/helper/findIndex";
import { checkResponseStatus } from "../../lib/helper/expectsAsserts";
import { fetchDataModificationL3, fetchDataModificationL1_L3_WH } from "../../lib/helper/dbQuerries";
import * as fs from 'fs';

const L3config = JSON.parse(fs.readFileSync('config/dataL3.json', 'utf8'));

/* test.describe("Modifikace L3",async () => {
    L3config.testConfigs.forEach(config => {
        test(`Změna HW pro ${config.tariff} L3 s hardware typem ${config.hardwareType}`, async ({ request }) => {
            const data = await fetchDataModificationL3('WHSDATA009','WWWW');
            if (!data) {
                throw new Error("Failed to fetch idWHS_SO from the database.");
            }
            
            const idASSET_sub = data.WHS_ASSET_ID1;
            const idASSET_ser = data.WHS_ASSET_ID2;
            const idASSET_ass1 = data.WHS_ASSET_ID3;
            const idASSET_ass2 = data.WHS_ASSET_ID4;
            const randomrsnNumber_OG = data.snNumber;
            const randomrid_OG = data.rid;
            const WHSHW_OG = data.HW;
            let idWHS_SO: string;
            let IndexOfWHSHWONT: number;
            
            await test.step("Create", async () => {
                let requestBody = await createModificationL3OrderBody(idASSET_sub, idASSET_ser, config.tariff, idASSET_ass1, WHSHW_OG, idASSET_ass2, randomrsnNumber_OG, randomrid_OG, config.hardwareType);

                const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
                    data: requestBody
                });
                
                await checkResponseStatus(response, 201);
                
                const body = await response.json();
                //console.log(JSON.stringify(body, null, 2));
                idWHS_SO = body.id[1].value;
                console.log(idWHS_SO)
            })    

            await test.step("Details required for provisioning", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                await checkResponseStatus(response, 200);
                
                const body = await waitForExpectedStatus(request, "WaitForRealization", idWHS_SO, 10, 5000);
                IndexOfWHSHWONT = findIndexOfWHSHWONT(body);
                //console.log(JSON.stringify(body, null, 2));
            })
            
            await test.step("WHS Partner requests provisioning start", async () => {
                let requestBody = await serviceOrderL3Provisioning(IndexOfWHSHWONT);

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

                const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO, 60, 5000);
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
}); */

const L1config = JSON.parse(fs.readFileSync('config/dataL1.json', 'utf8'));

test.describe("Modifikace L1 - SWAP HW",async () => {
    L1config.hardwarePairs.forEach(pair  => {
        test(`Změna HW z ${pair.original} na ${pair.new} pro L1`, async ({ request }) => {
            const data = await fetchDataModificationL1_L3_WH(pair.original);
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
                let requestBody = await createModificationSwapHWL1OrderBody(idASSET_sub, idASSET_ser, WHSDATA, idASSET_ass1, WHSHW_OG, idASSET_ass2, macAddress, pair.new);

                const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
                    data: requestBody
                });
                
                await checkResponseStatus(response, 201);
                
                const body = await response.json();
                //console.log(JSON.stringify(body, null, 2));
                idWHS_SO = body.id[1].value;
                console.log(idWHS_SO)
            })
            
            await test.step("Ask for status NoAppointment", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                await checkResponseStatus(response, 200);
                
                const body = await waitForExpectedStatus(request, "NoAppointment", idWHS_SO, 10, 5000);
                //console.log(JSON.stringify(body, null, 2));
            })
            
            await test.step("WHS Partner requests provisioning start", async () => {
                const macAddress = generateMacAddress()
                let requestBody = await TEMPserviceOrderL1Provisioning(macAddress);

                const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                    data: requestBody
                });

                await checkResponseStatus(response, 200);

                const body = await response.json();
                //console.log(JSON.stringify(body, null, 2));
            })

            await test.step("Ask for status NoAppointment", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                await checkResponseStatus(response, 200);
                
                const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO, 10, 5000);
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

test.describe("Modifikace L3 - SWAP HW",async () => {
    L3config.hardwarePairs.forEach(pair  => {
        test(`Změna HW z ${pair.original} na ${pair.new} pro L3`, async ({ request }) => {
            const data = await fetchDataModificationL1_L3_WH(pair.original);
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
            let idWHS_SO: string;
            let IndexOfWHSHWONT: number;
            
            await test.step("Create", async () => {
                let requestBody = await createModificationSwapHWL3OrderBody(idASSET_sub, idASSET_ser, WHSDATA, idASSET_ass1, WHSHW_OG, idASSET_ass2, randomrsnNumber_OG, randomrid_OG, pair.new);

                const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
                    data: requestBody
                });
                
                await checkResponseStatus(response, 201);
                
                const body = await response.json();
                //console.log(JSON.stringify(body, null, 2));
                idWHS_SO = body.id[1].value;
                console.log(idWHS_SO)
            })  
            
            await test.step("Ask for status NoAppointment", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                await checkResponseStatus(response, 200);
                
                const body = await waitForExpectedStatus(request, "WaitForRealization", idWHS_SO, 10, 5000);
                IndexOfWHSHWONT = findIndexOfWHSHWONT(body);
                //console.log(JSON.stringify(body, null, 2));
            })  

            await test.step("Details required for provisioning #2", async () => {
                let requestBody = await serviceOrderL3Provisioning(IndexOfWHSHWONT);

                const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                    data: requestBody
                });

                await checkResponseStatus(response, 200);
                
                const body = await response.json();
                console.log(JSON.stringify(body, null, 2));
                //console.log();
            })

            await test.step("Ask for status NoAppointment", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                await checkResponseStatus(response, 200);
                
                const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO, 10, 5000);
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