import { test, expect } from "@playwright/test";

test("GET blabla", async ({ request }) => {
    const response = await request.get("/customerServiceInventoryItemAPI/v2/customerServiceInventoryItem/1080002866");

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log(JSON.stringify(body, null, 2)); // pro běžné formátování objektu
  });

