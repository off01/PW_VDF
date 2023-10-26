import { test, expect } from "@playwright/test"
import { createActivationL1OrderBody } from "../../lib/datafactory/createOrder"
import { questionaryL1 } from "../../lib/datafactory/partyFeedback"
import { customerAppointmentL1 } from "../../lib/datafactory/customerAppointment"
import { getRandomElement, extractWHSWAS } from "../../lib/helper/listofflats";
import { waitForExpectedStatus } from "../../lib/helper/waitingStatus";
import { getTomorrowDate } from "../../lib/helper/timeGenerator";
import { recordResults } from "../../lib/helper/fileOperations";
import { checkResponseStatus } from "../../lib/helper/expectsAsserts";
import * as fs from 'fs';

const L1config = JSON.parse(fs.readFileSync('config/dataL1.json', 'utf8'));

test.describe(`Aktivace test L1 spolu s HW`,async () => {
    L1config.testConfigs.forEach(config => {
        test(`Aktivační objednávka pro ${config.tariff} L1 s hardware typem ${config.hardwareType}`, async ({ request }) => {
            let idWHS_SO: string = '';
            let idWHS_PFS: string;
            let idWHS_WAS: string;
            let idWHS_PF: string;
            let idASSET_ser: string = '';

            await test.step("Create", async () => {
                let requestBody = await createActivationL1OrderBody(config.tariff, config.hardwareType);

                const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
                    data: requestBody
                });
                
                await checkResponseStatus(response, 201);
                
                const body = await response.json();
                idWHS_SO = body.id[1].value;
                idASSET_ser = body.parts.lineItem[1].serviceSpecification[0].characteristicsValue[0].value
            })    

            await test.step("Ask for status QuestionsReady", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                await checkResponseStatus(response, 200);
                
                const body = await waitForExpectedStatus(request, "QuestionsReady", idWHS_SO, 10, 5000);
                //console.log(JSON.stringify(body, null, 2));
            })  

            await test.step("Details required for provisioning", async () => {
                const response = await request.get(`/partyFeedbackSpecificationAPI/partyFeedbackSpecification?relatedObjectId=${idWHS_SO}`);

                await checkResponseStatus(response, 200);
                
                const body = await response.json();
                idWHS_PFS = body[0].ids[0].value;
            })

            await test.step("Create", async () => {
                let requestBody = await questionaryL1(idWHS_PFS, idWHS_SO);

                const response = await request.post(`/partyFeedbackAPI/partyFeedback`, {
                    data: requestBody
                });

                await checkResponseStatus(response, 201);

                const body = await response.json();
                idWHS_PF = body.id[1].value;
            }) 

            await test.step("Ask for status QuestionsReady", async () => {
                const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

                await checkResponseStatus(response, 200);

                const body = await waitForExpectedStatus(request, "AppointmentRequired", idWHS_SO);
            })   

            await test.step("Ask for status QuestionsReady", async () => {
                const tomorrowDate = await getTomorrowDate();
                const response = await request.get(`/WorkforceAppointmentSlotAPI/workforceAppointmentSlot?fromDate=${tomorrowDate}T06:00:00.000%2B01:00&relatedObjectId=${idWHS_SO}&type=Installation`);

                await checkResponseStatus(response, 200);

                const body = await response.json();
                const whs_was_ids = extractWHSWAS(body);
                idWHS_WAS = getRandomElement(whs_was_ids);
            })   

            await test.step("Create", async () => {
                let requestBody = await customerAppointmentL1(idWHS_WAS);

                const response = await request.post(`/customerAppointmentAPI/v2/customerAppointment`, {
                    data: requestBody
                });
                
                await checkResponseStatus(response, 201);
                
                const body = await response.json();
                //console.log(JSON.stringify(body, null, 2));
                console.log(idWHS_SO, idASSET_ser)
            })
            await recordResults(idWHS_SO, idASSET_ser); 
        });
    });    
});