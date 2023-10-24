import { test, expect } from "@playwright/test"
import { fetchOrderId } from "../../lib/helper/dbQuerries";

test.describe("Cancel test", async () => {
    test('Zrušení rozpracované objenávky', async ({ request }) => {
        const idWHS_SO = await fetchOrderId();
        if (!idWHS_SO) {
            throw new Error("Failed to fetch idWHS_SO from the database.");
        }

        await test.step("Details required for provisioning", async () => {
            const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);
            expect(response.status()).toBe(200);
            const body = await response.json();
            console.log(JSON.stringify(body, null, 2));
        })
    });
});