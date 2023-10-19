import { test, expect } from "@playwright/test"
import { serviceOrderCancel } from "../../lib/datafactory/serviceOrder";


test.describe("Cancel test",async () => {
    test('Zrušení rozpracované objenávky', async ({ request }) => {
        let idWHS_SO: string;
        
        await test.step("Details required for provisioning", async () => {
            const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

            expect(response.status()).toBe(200);
            const body = await response.json();
            //console.log(JSON.stringify(body, null, 2));
        })   

        await test.step("Details required for provisioning #2", async () => {
            let requestBody = await serviceOrderCancel();

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