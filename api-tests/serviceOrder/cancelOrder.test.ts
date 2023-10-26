import { test, expect } from "@playwright/test"
import { serviceOrderCancel } from "../../lib/datafactory/serviceOrder";
import { checkResponseStatus } from "../../lib/helper/expectsAsserts";
import { fetchOrderId } from "../../lib/helper/dbQuerries";


test.describe("Cancel test",async () => {
    test('Zrušení rozpracované objenávky', async ({ request }) => {
        const idWHS_SO = await fetchOrderId();
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