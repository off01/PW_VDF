import moment from "moment"
import { generateKey, generateRandomHex } from "../helper/randomGenerator"

export async function serviceOrderL3 (idlocationFlatId: string) {
    const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    let orderBody = [
        {
            "op": "replace",
            "path": "/status",
            "value": "FlatSelected"
        },
        {
            "op": "replace",
            "path": "/lastModified",
            "value": {
                "value": [
                    `${timestamp}`
                ]
            }
        },
        {
            "op": "replace",
            "path": "/lastModifiedBy",
            "value": {
                "value": "TRINITY",
                "schemeAgencyName": "TMCZ"
            }
        },
        {
            "op": "add",
            "path": "/parts.lineItem[0].serviceSpecification[0].characteristicsValue",
            "value": {
                "characteristicsValue": [
                    {
                        "characteristicName": "locationFlatId",
                        "value": `${idlocationFlatId}`
                    }
                ]
            }
        }
    ];
    return orderBody;
}

export async function serviceOrderL3Provisioning (IndexOfWHSHWONT: number) {
    const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    const randomrid = generateKey();
    const randomrsnNumber = generateRandomHex();
    let orderBody = [
        {
            "op": "replace",
            "path": "/status",
            "value": "Provisioning"
        },
        {
            "op": "replace",
            "path": "/lastModified",
            "value": {
                "value": [
                    `${timestamp}`
                ]
            }
        },
        {
            "op": "replace",
            "path": "/lastModifiedBy",
            "value": {
                "value": "SMITH",
                "schemeAgencyName": "TMCZ"
            }
        },
        {
            "op": "add",
            "path": `/parts.lineItem[${IndexOfWHSHWONT}].serviceSpecification[0].characteristicsValue`,
            "value": {
                "characteristicsValue": [
                    {
                        "characteristicName": "snNumber",
                        "value": `${randomrsnNumber}`
                    },
                    {
                        "characteristicName": "hwType",
                        "value": "Raisecom ISCOM HT803G-07"
                    },
                    {
                        "characteristicName": "rid",
                        "value": `${randomrid}`
                    }
                ]
            }
        }
    ];
    return orderBody;
}

export async function serviceOrderCancel () {
    const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    let orderBody = [
        {
            "op": "replace",
            "path": "/status",
            "value": "Canceled"
        },
        {
            "op": "replace",
            "path": "/lastModified",
            "value": {
                "value": `${timestamp}`
            }
        },
        {
            "op": "replace",
            "path": "/lastModifiedBy",
            "value": {
                "value": "TRINITY",
                "schemeAgencyName": "TMCZ"
            }
        },
        {
            "op": "add",
            "path": "/parts.lineItem[0].serviceSpecification[0].characteristicsValue",
            "value": {
                "characteristicsValue": [
                    {
                        "characteristicName": "reason",
                        "value": "101"
                    },
                    {
                        "characteristicName": "reasonText",
                        "value": "WHS Partner decided to cancel the order"
                    }
                ]
            }
        }
    ];
    return orderBody;
}

export async function serviceOrderProvisioning () {
    const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    let orderBody = [
        {
            "op": "replace",
            "path": "/status",
            "value": "Provisioning"
        },
        {
            "op": "replace",
            "path": "/lastModified",
            "value": {
                "value": `${timestamp}`
            }
        },
        {
            "op": "replace",
            "path": "/lastModifiedBy",
            "value": {
                "value": "TRINITY",
                "schemeAgencyName": "TMCZ"
            }
        }
    ];
    return orderBody;
}

export async function serviceOrderL1Provisioning (macAddress: string) {
    const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    let orderBody = [
        {
            "op": "replace",
            "path": "/status",
            "value": "Provisioning"
        },
        {
            "op": "replace",
            "path": "/lastModified",
            "value": {
                "value": `${timestamp}`
            }
        },
        {
            "op": "replace",
            "path": "/lastModifiedBy",
            "value": {
                "value": "API2VF",
                "schemeAgencyName": "TMCZ"
            }
        },
        {
            "op": "add",
            "path": "/parts.lineItem[3].serviceSpecification[0].characteristicsValue",
            "value": {
                "characteristicsValue": [
                    {
                        "characteristicName": "macAddress",
                        "value": `${macAddress}`
                    },
                    {
                        "characteristicName": "hwType",
                        "value": "Compal CH7465"
                    }
                ]
            }
        }
    ];
    return orderBody;
}

export async function TEMPserviceOrderL1Provisioning (macAddress: string) {
    const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    let orderBody = [
        {
            "op": "replace",
            "path": "/status",
            "value": "Provisioning"
        },
        {
            "op": "replace",
            "path": "/lastModified",
            "value": {
                "value": `${timestamp}`
            }
        },
        {
            "op": "replace",
            "path": "/lastModifiedBy",
            "value": {
                "value": "API2VF",
                "schemeAgencyName": "TMCZ"
            }
        },
        {
            "op": "add",
            "path": "/parts.lineItem[4].serviceSpecification[0].characteristicsValue",
            "value": {
                "characteristicsValue": [
                    {
                        "characteristicName": "macAddress",
                        "value": `${macAddress}`
                    },
                    {
                        "characteristicName": "hwType",
                        "value": "Compal CH7465"
                    }
                ]
            }
        }
    ];
    return orderBody;
}

export async function serviceOrderClosed () {
    const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    let orderBody = [
        {
            "op": "replace",
            "path": "/status",
            "value": "Closed"
        },
        {
            "op": "replace",
            "path": "/lastModified",
            "value": {
                "value": `${timestamp}`
            }
        },
        {
            "op": "replace",
            "path": "/lastModifiedBy",
            "value": {
                "value": "TRINITY",
                "schemeAgencyName": "TMCZ"
            }
        }
    ];
    return orderBody;
}
