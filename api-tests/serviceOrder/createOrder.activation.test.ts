import { test, expect } from "@playwright/test"
import { createActivationL3OrderBody, createActivationL1OrderBody } from "../../lib/datafactory/createOrder"
import { questionaryL1 } from "../../lib/datafactory/partyFeedback"
import { customerAppointmentL1 } from "../../lib/datafactory/customerAppointment"
import { checkL3 } from "../../lib/datafactory/serviceFeasibility"
import { getLocationFlatIdsWithCondition, getRandomElement, extractWHSWAS } from "../../lib/helper/listofflats";
import { serviceOrderL3, serviceOrderL3Provisioning, } from "../../lib/datafactory/serviceOrder";
import { waitForExpectedStatus } from "../../lib/helper/waitingStatus";
import { findIndexOfWHSHWONT } from "../../lib/helper/findIndex";
import { getTomorrowDate } from "../../lib/helper/timeGenerator";
//import { getTariffs } from "../../lib/helper/fileOperations";
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('config/tariffs.json', 'utf8'));

test.describe("Aktivace test L3",async () => {
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
            //console.log(idbuildingId)
            //console.log(idWHS_SO)
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

test.describe(`Aktivace test L1`,async () => {
    config.tariffs.forEach(tariff => {
        test(`test13232 pro tarif ${tariff}`, async ({ request }) => {
            let idWHS_SO: string;
            let idWHS_PFS: string;
            let idWHS_WAS: string;
            let idWHS_PF: string;
            let idASSET_ser: string;

            await test.step("Create", async () => {
                let requestBody = await createActivationL1OrderBody(tariff);

                const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
                    data: requestBody
                });
                
                expect(response.status()).toBe(201);
                
                const body = await response.json();
                idWHS_SO = body.id[1].value;
                idASSET_ser = body.parts.lineItem[1].serviceSpecification[0].characteristicsValue[0].value
            })    

            await test.step("Ask for status QuestionsReady", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                expect(response.status()).toBe(200);
                
                const body = await waitForExpectedStatus(request, "QuestionsReady", idWHS_SO, 10, 5000);
                //console.log(JSON.stringify(body, null, 2));
            })  

            await test.step("Details required for provisioning", async () => {
                const response = await request.get(`/partyFeedbackSpecificationAPI/partyFeedbackSpecification?relatedObjectId=${idWHS_SO}`);

                expect(response.status()).toBe(200);
                
                const body = await response.json();
                idWHS_PFS = body[0].ids[0].value;
            })

            await test.step("Create", async () => {
                let requestBody = await questionaryL1(idWHS_PFS, idWHS_SO);

                const response = await request.post(`/partyFeedbackAPI/partyFeedback`, {
                    data: requestBody
                });

                expect(response.status()).toBe(201);

                const body = await response.json();
                idWHS_PF = body.id[1].value;
            }) 

            await test.step("Ask for status QuestionsReady", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                expect(response.status()).toBe(200);

                const body = await waitForExpectedStatus(request, "AppointmentRequired", idWHS_SO);
            })   

            await test.step("Ask for status QuestionsReady", async () => {
                const tomorrowDate = await getTomorrowDate();
                const response = await request.get(`/WorkforceAppointmentSlotAPI/workforceAppointmentSlot?fromDate=${tomorrowDate}T06:00:00.000%2B01:00&relatedObjectId=${idWHS_SO}&type=Installation`);

                expect(response.status()).toBe(200);

                const body = await response.json();
                const whs_was_ids = extractWHSWAS(body);
                idWHS_WAS = getRandomElement(whs_was_ids);
            })   

            await test.step("Create", async () => {
                let requestBody = await customerAppointmentL1(idWHS_WAS);

                const response = await request.post(`/customerAppointmentAPI/v2/customerAppointment`, {
                    data: requestBody
                });
                
                expect(response.status()).toBe(201);
                const body = await response.json();
                //console.log(JSON.stringify(body, null, 2));
                console.log(idWHS_SO, idASSET_ser)
            })
        });
    });    
});