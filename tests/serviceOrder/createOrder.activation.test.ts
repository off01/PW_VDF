import { test, expect } from "@playwright/test"
import { createActivationL3OrderBody } from "../../lib/datafactory/createOrder"
import { checkL3 } from "../../lib/datafactory/serviceFeasibility"
import { getLocationFlatIdsWithCondition, getRandomElement } from "../../lib/helper/listofflats";
import { serviceOrderL3, serviceOrderL3Provisioning } from "../../lib/datafactory/serviceOrder";
import { waitForExpectedStatus } from "../../lib/helper/waitingStatus";
import { findIndexOfWHSHWONT } from "../../lib/helper/findIndex";


test.describe("Aktivace test",async () => {
    test('Aktivační objenávka pro WHSDATA009 L3', async ({ request }) => {
        let idbuildingId: string;
        let idWHS_SO: string;
        let idlocationFlatId: string;
        let IndexOfWHSHWONT: number;

        
        await test.step("Create", async () => {
            let requestBody = await createActivationL3OrderBody();

            const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
                data: requestBody
            });
            expect(response.status()).toBe(201);
            const body = await response.json();
            //console.log(JSON.stringify(body, null, 2));
            idbuildingId = body.parts.lineItem[0].serviceSite.contactPeople[0].contactPerson.contactPoint[0].postal.characteristic.characteristicsValue[1].value;
            idWHS_SO = body.id[1].value;
            console.log(idbuildingId)
            console.log(idWHS_SO)
        })    

        await test.step("serviceFeasibility", async () => {
            let requestBody = await checkL3(idbuildingId, idWHS_SO);

            const response = await request.post(`/serviceFeasibilityAPI/v2/serviceFeasibility/check`, {
                data: requestBody
            });
            expect(response.status()).toBe(200);
            const body = await response.json();
            //console.log(JSON.stringify(body, null, 2));
            let availableFlatIds = getLocationFlatIdsWithCondition(body);
            idlocationFlatId = getRandomElement(availableFlatIds);
            //console.log(idlocationFlatId)
            //console.log(availableFlatIds)
        })    

        await test.step("Info about selected locationFlatid", async () => {
            const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

            expect(response.status()).toBe(200);
            const body = await waitForExpectedStatus(request, "WaitForRealization", idWHS_SO);
            //console.log(JSON.stringify(body, null, 2));
        })   

        await test.step("Info about selected locationFlatid #2", async () => {
            let requestBody = await serviceOrderL3(idlocationFlatId);

            const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                data: requestBody
            });
            expect(response.status()).toBe(200);
            const body = await response.json();
            console.log(JSON.stringify(body, null, 2));
        })

        await test.step("Details required for provisioning", async () => {
            const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

            expect(response.status()).toBe(200);
            const body = await response.json();
            IndexOfWHSHWONT = findIndexOfWHSHWONT(body);
            //console.log(JSON.stringify(body, null, 2));
        })   

        await test.step("Details required for provisioning #2", async () => {
            let requestBody = await serviceOrderL3Provisioning(IndexOfWHSHWONT);

            const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                data: requestBody
            });

            expect(response.status()).toBe(200);
            const body = await response.json();
            console.log(JSON.stringify(body, null, 2));
            //console.log();
        })   
    });
});