import { test, expect } from "@playwright/test"
import { fetchDataModificationL3 } from "../../lib/helper/dbQuerries";



test.describe("Resume L1",async () => {
    test('Obnovení suspendovaného assetu', async ({ request }) => {
        const data  = await fetchDataModificationL3();
        if (!data) {
            throw new Error("Failed to fetch idWHS_SO from the database.");
        }
        
        const idASSET_sub = data.WHS_ASSET_ID1;
        const idASSET_ser = data.WHS_ASSET_ID2;
        const idASSET_ass1 = data.WHS_ASSET_ID3;
        const idASSET_ass2 = data.WHS_ASSET_ID4;
        const randomrsnNumber_OG = data.snNumber;
        const randomrid_OG = data.rid;
        const WHSHW_OG = data.HW;
        const macAddress = data.macAddress;

        console.log(idASSET_sub)
        console.log(idASSET_ser)
        console.log(idASSET_ass1)
        console.log(idASSET_ass2)
        console.log(randomrsnNumber_OG)
        console.log(randomrid_OG)
        console.log(WHSHW_OG)
        console.log(macAddress)
    });
});