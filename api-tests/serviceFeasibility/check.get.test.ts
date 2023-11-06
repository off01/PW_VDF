import { test, expect } from "@playwright/test"
import { checkResponseStatus } from "../../lib/helper/expectsAsserts";
import { fetchOrderIdCancelL3 } from "../../lib/helper/dbQuerries";

test.describe("Ověření funkčnosti GET", async () => {
    test('Návrat rozpracované objednávky', async ({ request }) => {
        const idWHS_SO = await fetchOrderIdCancelL3();
        if (!idWHS_SO) {
            throw new Error("Failed to fetch idWHS_SO from the database.");
        }

        await test.step("Details required for provisioning", async () => {
            const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

            await checkResponseStatus(response, 200);
            
            const body = await response.json();
            //console.log(JSON.stringify(body, null, 2));
        })
    });
});