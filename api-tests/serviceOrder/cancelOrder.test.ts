import { test, expect } from "@playwright/test"
import { serviceOrderCancel } from "../../lib/datafactory/serviceOrder";
import { checkResponseStatus, checkForNullValues } from "../../lib/helper/expectsAsserts";
import { fetchOrderIdCancelL3, fetchOrderIdCancelL1 } from "../../lib/helper/dbQuerries";


test.describe("Cancel L3",async () => {
    test('Zrušení rozpracované objednávky L3', async ({ request }) => {
        const idWHS_SO = await fetchOrderIdCancelL3();
        if (!idWHS_SO) {
            throw new Error("Failed to fetch idWHS_SO from the database.");
        }
        
        await test.step("Details required for provisioning", async () => {
            const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

            await checkResponseStatus(response, 200);

            const body = await response.json();
            expect(checkForNullValues(body)).toBe(false)
            //console.log(JSON.stringify(body, null, 2));
        })   

        await test.step("Details required for provisioning #2", async () => {
            let requestBody = await serviceOrderCancel();

            const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                data: requestBody
            });

            await checkResponseStatus(response, 200);
            
            const body = await response.json();
            expect(checkForNullValues(body)).toBe(false)
            console.log(idWHS_SO);
        })   
    });
});

test.describe("Cancel L1",async () => {
    test('Zrušení rozpracované objednávky L1', async ({ request }) => {
        const idWHS_SO = await fetchOrderIdCancelL1();
        if (!idWHS_SO) {
            throw new Error("Failed to fetch idWHS_SO from the database.");
        }
        
        await test.step("Details required for provisioning", async () => {
            const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

            await checkResponseStatus(response, 200);

            const body = await response.json();
            //console.log(JSON.stringify(body, null, 2));
        })   

        await test.step("Details required for provisioning #2", async () => {
            let requestBody = await serviceOrderCancel();

            const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                data: requestBody
            });

            await checkResponseStatus(response, 200);
            
            const body = await response.json();
            //console.log(JSON.stringify(body, null, 2));
            console.log(idWHS_SO);
        })   
    });
});