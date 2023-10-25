import { test, expect } from "@playwright/test"
import { createTerminationL3OrderBody, createTerminationL1OrderBody } from "../../lib/datafactory/createOrder"
import { serviceOrderProvisioning, serviceOrderClosed } from "../../lib/datafactory/serviceOrder";
import { waitForExpectedStatus } from "../../lib/helper/waitingStatus";
import { fetchOrderIdTerminationL3, fetchOrderIdTerminationL1 } from "../../lib/helper/dbQuerries";


test.describe("Terminace L3",async () => {
    test('Terminační objenávka pro L3', async ({ request }) => {
        const idASSET_sub = await fetchOrderIdTerminationL3();
        if (!idASSET_sub) {
            throw new Error("Failed to fetch idWHS_SO from the database.");
        }
        let idWHS_SO: string;
        
        await test.step("Create", async () => {
            let requestBody = await createTerminationL3OrderBody(idASSET_sub);

            const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
                data: requestBody
            });
            expect(response.status()).toBe(201);
            const body = await response.json();
            console.log(JSON.stringify(body, null, 2));
            idWHS_SO = body.id[1].value;
            console.log(idASSET_sub)
            console.log(idWHS_SO)
        })    

        await test.step("Ask for status", async () => {
            const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

            expect(response.status()).toBe(200);
            const body = await waitForExpectedStatus(request, "WaitForRealization", idWHS_SO);
            //console.log(JSON.stringify(body, null, 2));
        })
        
        await test.step("WHS Partner requests provisioning start", async () => {
            let requestBody = await serviceOrderProvisioning();

            const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                data: requestBody
            });
            expect(response.status()).toBe(200);
            const body = await response.json();
            console.log(JSON.stringify(body, null, 2));
        })

        await test.step("Ask for status", async () => {
            const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

            expect(response.status()).toBe(200);
            const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO);
            //console.log(JSON.stringify(body, null, 2));
        })

        await test.step("Close", async () => {
            let requestBody = await serviceOrderClosed();

            const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                data: requestBody
            });
            expect(response.status()).toBe(200);
            const body = await response.json();
            console.log(JSON.stringify(body, null, 2));
        })
    });
});

test.describe("Terminace L1",async () => {
    test('Terminační objenávka pro L1', async ({ request }) => {
        const idASSET_sub = await fetchOrderIdTerminationL1();
        if (!idASSET_sub) {
            throw new Error("Failed to fetch idWHS_SO from the database.");
        }
        let idWHS_SO: string;
        
        await test.step("Create", async () => {
            let requestBody = await createTerminationL1OrderBody(idASSET_sub);

            const response = await request.post(`/serviceOrderAPI/v2/serviceOrder`, {
                data: requestBody
            });
            expect(response.status()).toBe(201);
            const body = await response.json();
            console.log(JSON.stringify(body, null, 2));
            idWHS_SO = body.id[1].value;
            console.log(idASSET_sub)
            console.log(idWHS_SO)
        })    

        await test.step("Ask for status", async () => {
            const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

            expect(response.status()).toBe(200);
            const body = await waitForExpectedStatus(request, "NoAppointment", idWHS_SO);
            //console.log(JSON.stringify(body, null, 2));
        })
        
        await test.step("WHS Partner requests provisioning start", async () => {
            let requestBody = await serviceOrderProvisioning();

            const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                data: requestBody
            });
            expect(response.status()).toBe(200);
            const body = await response.json();
            console.log(JSON.stringify(body, null, 2));
        })

        await test.step("Ask for status", async () => {
            const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`);

            expect(response.status()).toBe(200);
            const body = await waitForExpectedStatus(request, "OrderProvisioned", idWHS_SO);
            //console.log(JSON.stringify(body, null, 2));
        })

        await test.step("Close", async () => {
            let requestBody = await serviceOrderClosed();

            const response = await request.patch(`/serviceOrderAPI/v2/serviceOrder/${idWHS_SO}`, {
                data: requestBody
            });
            expect(response.status()).toBe(200);
            const body = await response.json();
            console.log(JSON.stringify(body, null, 2));
        })
    });
});