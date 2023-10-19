import { expect, request } from "@playwright/test";
import { incrementCounterOrderId } from "../helper/counterHelper"
import moment from "moment"

export async function createActivationL3OrderBody () {
    const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    const idSO = incrementCounterOrderId();
    let orderBody = {
        "id": [
            {
                "value": `PW_${idSO}`,
                "schemeAgencyName": "TMCZ"
            }
        ],
        "status": "New",
        "type": "Activation",
        "created": {
            "value": `${timestamp}`
        },
        "createdBy": {
            "value": "TRINITY",
            "schemeAgencyName": "TMCZ"
        },
        "parts": {
            "lineItem": [
                {
                    "id": [
                        {
                            "value": "1",
                            "schemeAgencyName": "TMCZ"
                        }
                    ],
                    "status": "New",
                    "action": "Create",
                    "serviceSpecification": [
                        {
                            "id": [
                                {
                                    "value": "WHSFTTHCONN",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ]
                        }
                    ],
                    "serviceSite": {
                        "contactPeople": [
                            {
                                "contactPerson": {
                                    "contactPoint": [
                                        {
                                            "postal": {
                                                "characteristic": {
                                                    "characteristicsValue": [
                                                        {
                                                            "characteristicName": "buildingId",
                                                            "value": "1026629" // Natvrdo daný - chtělo by to parametrizovanou úpravu 
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "id": [
                        {
                            "value": "2",
                            "schemeAgencyName": "TMCZ"
                        }
                    ],
                    "status": "New",
                    "action": "Create",
                    "relatedLineItem": [
                        {
                            "id": [
                                {
                                    "value": "1",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ]
                        }
                    ],
                    "serviceSpecification": [
                        {
                            "id": [
                                {
                                    "value": "WHSFBBSERVICE",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": [
                        {
                            "value": "3",
                            "schemeAgencyName": "TMCZ"
                        }
                    ],
                    "status": "New",
                    "action": "Create",
                    "relatedLineItem": [
                        {
                            "id": [
                                {
                                    "value": "2",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ]
                        }
                    ],
                    "serviceSpecification": [
                        {
                            "id": [
                                {
                                    "value": "WHSDATA009",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": [
                        {
                            "value": "4",
                            "schemeAgencyName": "TMCZ"
                        }
                    ],
                    "status": "New",
                    "action": "Create",
                    "relatedLineItem": [
                        {
                            "id": [
                                {
                                    "value": "2",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ]
                        }
                    ],
                    "serviceSpecification": [
                        {
                            "id": [
                                {
                                    "value": "WHSHWONT",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ]
                        }
                    ]
                }
            ],
            "note": [
                {
                    "content": "Optional information"
                }
            ]
        }
    };
    return orderBody;
}

export async function createModificationL3OrderBody () {
    const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    const idSO = incrementCounterOrderId();
    let orderBody = {
        "id": [
            {
                "value": `PW_${idSO}`,
                "schemeAgencyName": "TMCZ"
            }
        ],
        "status": "New",
        "type": "Modification",
        "created": {
            "value": `${timestamp}`
        },
        "createdBy": {
            "value": "SMITH",
            "schemeAgencyName": "TMCZ"
        },
        "parts": {
            "lineItem": [
                {
                    "id": [
                        {
                            "value": "1",
                            "schemeAgencyName": "TMCZ"
                        }
                    ],
                    "status": "New",
                    "action": "NoChange",
                    "serviceSpecification": [
                        {
                            "id": [
                                {
                                    "value": "WHSFTTHCONN",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ],
                            "characteristicsValue": [
                                {
                                    "characteristicName": "whsAssetId",
                                    "value": "{{idASSET_sub}}"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": [
                        {
                            "value": "2",
                            "schemeAgencyName": "TMCZ"
                        }
                    ],
                    "status": "New",
                    "action": "NoChange",
                    "relatedLineItem": [
                        {
                            "id": [
                                {
                                    "value": "1",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ]
                        }
                    ],
                    "serviceSpecification": [
                        {
                            "id": [
                                {
                                    "value": "WHSFBBSERVICE",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ],
                            "characteristicsValue": [
                                {
                                    "characteristicName": "whsAssetId",
                                    "value": "{{idASSET_ser}}"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": [
                        {
                            "value": "3",
                            "schemeAgencyName": "TMCZ"
                        }
                    ],
                    "status": "New",
                    "action": "NoChange",
                    "relatedLineItem": [
                        {
                            "id": [
                                {
                                    "value": "2",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ]
                        }
                    ],
                    "serviceSpecification": [
                        {
                            "id": [
                                {
                                    "value": "WHSDATA009",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ],
                            "characteristicsValue": [
                                {
                                    "characteristicName": "whsAssetId",
                                    "value": "{{idASSET_ass1}}"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": [
                        {
                            "value": "4",
                            "schemeAgencyName": "TMCZ"
                        }
                    ],
                    "status": "New",
                    "action": "Delete",
                    "relatedLineItem": [
                        {
                            "id": [
                                {
                                    "value": "2",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ]
                        }
                    ],
                    "serviceSpecification": [
                        {
                            "id": [
                                {
                                    "value": "WHSHWONT",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ],
                            "characteristicsValue": [
                                {
                                    "characteristicName": "whsAssetId",
                                    "value": "{{idASSET_ass2}}"
                                },
                                {
                                    "characteristicName": "snNumber",
                                    "value": "{{randomrsnNumber}}"
                                },
                                {
                                    "characteristicName": "hwType",
                                    "value": "Raisecom ISCOM HT803G-07"
                                },
                                {
                                    "characteristicName": "rid",
                                    "value": "{{randomrid}}"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": [
                        {
                            "value": "5",
                            "schemeAgencyName": "TMCZ"
                        }
                    ],
                    "status": "New",
                    "action": "Create",
                    "relatedLineItem": [
                        {
                            "id": [
                                {
                                    "value": "2",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ]
                        }
                    ],
                    "serviceSpecification": [
                        {
                            "id": [
                                {
                                    "value": "WHSHWONT",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ]
                        }
                    ]
                }
            ],
            "note": [
                {
                    "content": "Optional information"
                }
            ]
        }
    };
    return orderBody;
}

export async function createTerminationL3OrderBody () {
    const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    const idSO = incrementCounterOrderId();
    let orderBody = {
        "id": [
            {
                "value": `PW_${idSO}`,
                "schemeAgencyName": "TMCZ"
            }
        ],
        "status": "New",
        "type": "Termination",
        "created": {
            "value": `${timestamp}`
        },
        "createdBy": {
            "value": "TRINITY",
            "schemeAgencyName": "TMCZ"
        },
        "parts": {
            "lineItem": [
                {
                    "id": [
                        {
                            "value": "1",
                            "schemeAgencyName": "TMCZ"
                        }
                    ],
                    "status": "New",
                    "action": "Delete",
                    "serviceSpecification": [
                        {
                            "id": [
                                {
                                    "value": "WHSFTTHCONN",
                                    "schemeAgencyName": "TMCZ"
                                }
                            ],
                            "characteristicsValue": [
                                {
                                    "characteristicName": "whsAssetId",
                                    "value": "{{idASSET_sub}}"
                                }
                            ]
                        }
                    ]
                }
            ],
            "note": [
                {
                    "content": "Optional information"
                }
            ]
        }
    };
    return orderBody;
}