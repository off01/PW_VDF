import { test, expect } from "@playwright/test"
import { serviceResume } from "../../lib/datafactory/customerServiceInventoryItem"
import { checkResponseStatus } from "../../lib/helper/expectsAsserts";
import { fetchInactiveAssetId } from "../../lib/helper/dbQuerries";



test.describe("Resume L1",async () => {
    test('Obnovení suspendovaného assetu', async ({ request }) => {
        const idASSET_sub = await fetchInactiveAssetId();
        if (!idASSET_sub) {
            throw new Error("Failed to fetch idWHS_SO from the database.");
        }
        
        await test.step("WHS Partner requests provisioning start", async () => {
            let requestBody = await serviceResume();

            const response = await request.patch(`/customerServiceInventoryItemAPI/v2/customerServiceInventoryItem/${idASSET_sub}`, {
                data: requestBody
            });

            await checkResponseStatus(response, 200);

            const body = await response.json();
            console.log(JSON.stringify(body, null, 2));
        })
    });
});