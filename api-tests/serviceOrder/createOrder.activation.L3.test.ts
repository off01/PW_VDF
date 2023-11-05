import { test, expect } from "@playwright/test"
import { createActivationL3OrderBody } from "../../lib/datafactory/createOrder"
import { checkL3 } from "../../lib/datafactory/serviceFeasibility"
import { getLocationFlatIdsWithCondition, getRandomElement } from "../../lib/helper/listofflats";
import { serviceOrderL3, serviceOrderL3Provisioning, } from "../../lib/datafactory/serviceOrder";
import { waitForExpectedStatus } from "../../lib/helper/waitingStatus";
import { findIndexOfWHSHWONT } from "../../lib/helper/findIndex";
import { checkResponseStatus, checkForNullValues } from "../../lib/helper/expectsAsserts";
//import { getTariffs } from "../../lib/helper/fileOperations";
import * as fs from 'fs';

const L3config = JSON.parse(fs.readFileSync('config/dataL3.json', 'utf8'));

test.describe("Aktivace test L3 spolu s HW",async () => {
    L3config.testConfigs.forEach(config => {
        test(`Aktivační objednávka pro ${config.tariff} L3 s hardware typem ${config.hardwareType}`, async ({ request }) => {
            let idbuildingId: string;
            let idWHS_SO: string;
            let idlocationFlatId: string;
            let IndexOfWHSHWONT: number;

            
            await test.step("Create", async () => {
                let requestBody = await createActivationL3OrderBody(config.tariff, config.hardwareType);

                const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
                    data: requestBody
                });

                await checkResponseStatus(response, 201);
                
                const body = await response.json();
                expect(checkForNullValues(body)).toBe(false)
                //console.log(JSON.stringify(body, null, 2));
                idbuildingId = body.parts.lineItem[0].serviceSite.contactPeople[0].contactPerson.contactPoint[0].postal.characteristic.characteristicsValue[1].value;
                idWHS_SO = body.id[1].value;
                //console.log(idbuildingId)
                //console.log(idWHS_SO)
            })    

            await test.step("serviceFeasibility", async () => {
                let requestBody = await checkL3(idbuildingId, idWHS_SO);

                const response = await request.post(`/serviceFeasibilityAPI/v2/serviceFeasibility/check`, {
                    data: requestBody
                });

                await checkResponseStatus(response, 200);
                
                const body = await response.json();
                expect(checkForNullValues(body)).toBe(false)
                //console.log(JSON.stringify(body, null, 2));
                let availableFlatIds = getLocationFlatIdsWithCondition(body);
                idlocationFlatId = getRandomElement(availableFlatIds);
                //console.log(idlocationFlatId)
                //console.log(availableFlatIds)
            })    

            await test.step("Info about selected locationFlatid", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                await checkResponseStatus(response, 200);

                const body = await waitForExpectedStatus(request, "WaitForRealization", idWHS_SO);
                expect(checkForNullValues(body)).toBe(false)
                //console.log(JSON.stringify(body, null, 2));
            })   

            await test.step("Info about selected locationFlatid #2", async () => {
                let requestBody = await serviceOrderL3(idlocationFlatId);

                const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                    data: requestBody
                });

                await checkResponseStatus(response, 200);

                const body = await response.json();
                expect(checkForNullValues(body)).toBe(false)
                console.log(JSON.stringify(body, null, 2));
            })

            await test.step("Details required for provisioning", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                await checkResponseStatus(response, 200);

                const body = await response.json();
                expect(checkForNullValues(body)).toBe(false)
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
                expect(checkForNullValues(body)).toBe(false)
                console.log(JSON.stringify(body, null, 2));
                //console.log();
            })   
        });
    });     
});
