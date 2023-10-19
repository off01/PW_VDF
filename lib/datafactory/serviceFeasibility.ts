import { expect, request } from "@playwright/test";
import { incrementCounterserviceFeasibilityId } from "../helper/counterHelper"
import moment from "moment"

export async function checkL3 (idbuildingId: string, idWHS_SO: string) {
    const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    const idSF = incrementCounterserviceFeasibilityId();
    let orderBody = {
        "id": [
            {
                "value": `SF_${idSF}`,
                "schemeAgencyName": "TMCZ"
            }
        ],
        "status": "NewFTTH",
        "created": {
            "value": `${timestamp}`
        },
        "createdBy": {
            "value": "NEO",
            "schemeAgencyName": "TMCZ"
        },
        "parts": {
            "location": {
                "ID": [
                    {
                        "value": `${idbuildingId}`,
                        "schemeAgencyName": "VFCZ"
                    }
                ]
            },
            "specification": {
                "characteristicsValue": [
                    {
                        "characteristicName": "whsServiceOrderId",
                        "value": `${idWHS_SO}`
                    }
                ]
            }
        }
    };
    return orderBody;
}