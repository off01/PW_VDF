import moment from "moment";
import { generateKey, generateRandomHex } from "@helper/randomGenerator";
import { incrementCounterOrderId } from "@helper/counterHelper";

export async function serviceOrderL3(idlocationFlatId: string) {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const orderBody = [
    {
      op: "replace",
      path: "/status",
      value: "FlatSelected",
    },
    {
      op: "replace",
      path: "/lastModified",
      value: {
        value: [`${timestamp}`],
      },
    },
    {
      op: "replace",
      path: "/lastModifiedBy",
      value: {
        value: "TRINITY",
        schemeAgencyName: "TMCZ",
      },
    },
    {
      op: "add",
      path: "/parts.lineItem[0].serviceSpecification[0].characteristicsValue",
      value: {
        characteristicsValue: [
          {
            characteristicName: "locationFlatId",
            value: `${idlocationFlatId}`,
          },
        ],
      },
    },
  ];
  return orderBody;
}

export async function serviceOrderL3Provisioning(IndexOfWHSHWONT: number) {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const randomrid = generateKey();
  const randomrsnNumber = generateRandomHex();
  const orderBody = [
    {
      op: "replace",
      path: "/status",
      value: "Provisioning",
    },
    {
      op: "replace",
      path: "/lastModified",
      value: {
        value: [`${timestamp}`],
      },
    },
    {
      op: "replace",
      path: "/lastModifiedBy",
      value: {
        value: "SMITH",
        schemeAgencyName: "TMCZ",
      },
    },
    {
      op: "add",
      path: `/parts.lineItem[${IndexOfWHSHWONT}].serviceSpecification[0].characteristicsValue`,
      value: {
        characteristicsValue: [
          {
            characteristicName: "snNumber",
            value: `${randomrsnNumber}`,
          },
          {
            characteristicName: "hwType",
            value: "Raisecom ISCOM HT803G-07",
          },
          {
            characteristicName: "rid",
            value: `${randomrid}`,
          },
        ],
      },
    },
  ];
  return orderBody;
}

export async function serviceOrderCancel(findIndexOfWHSHFCCONN: number) {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const orderBody = [
    {
      op: "replace",
      path: "/status",
      value: "Canceled",
    },
    {
      op: "replace",
      path: "/lastModified",
      value: {
        value: `${timestamp}`,
      },
    },
    {
      op: "replace",
      path: "/lastModifiedBy",
      value: {
        value: "TRINITY",
        schemeAgencyName: "TMCZ",
      },
    },
    {
      op: "add",
      path: `/parts.lineItem[${findIndexOfWHSHFCCONN}].serviceSpecification[0].characteristicsValue`,
      value: {
        characteristicsValue: [
          {
            characteristicName: "reason",
            value: "101",
          },
          {
            characteristicName: "reasonText",
            value: "WHS Partner decided to cancel the order",
          },
        ],
      },
    },
  ];
  return orderBody;
}

export async function serviceOrderProvisioning() {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const orderBody = [
    {
      op: "replace",
      path: "/status",
      value: "Provisioning",
    },
    {
      op: "replace",
      path: "/lastModified",
      value: {
        value: `${timestamp}`,
      },
    },
    {
      op: "replace",
      path: "/lastModifiedBy",
      value: {
        value: "TRINITY",
        schemeAgencyName: "TMCZ",
      },
    },
  ];
  return orderBody;
}

export async function serviceOrderL1Provisioning(macAddress: string) {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const orderBody = [
    {
      op: "replace",
      path: "/status",
      value: "Provisioning",
    },
    {
      op: "replace",
      path: "/lastModified",
      value: {
        value: `${timestamp}`,
      },
    },
    {
      op: "replace",
      path: "/lastModifiedBy",
      value: {
        value: "API2VF",
        schemeAgencyName: "TMCZ",
      },
    },
    {
      op: "add",
      path: "/parts.lineItem[3].serviceSpecification[0].characteristicsValue",
      value: {
        characteristicsValue: [
          {
            characteristicName: "macAddress",
            value: `${macAddress}`,
          },
          {
            characteristicName: "hwType",
            value: "Compal CH7465",
          },
        ],
      },
    },
  ];
  return orderBody;
}

export async function TEMPserviceOrderL1Provisioning(macAddress: string) {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const orderBody = [
    {
      op: "replace",
      path: "/status",
      value: "Provisioning",
    },
    {
      op: "replace",
      path: "/lastModified",
      value: {
        value: `${timestamp}`,
      },
    },
    {
      op: "replace",
      path: "/lastModifiedBy",
      value: {
        value: "API2VF",
        schemeAgencyName: "TMCZ",
      },
    },
    {
      op: "add",
      path: "/parts.lineItem[4].serviceSpecification[0].characteristicsValue",
      value: {
        characteristicsValue: [
          {
            characteristicName: "macAddress",
            value: `${macAddress}`,
          },
          {
            characteristicName: "hwType",
            value: "Compal CH7465",
          },
        ],
      },
    },
  ];
  return orderBody;
}

export async function serviceOrderClosed() {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const orderBody = [
    {
      op: "replace",
      path: "/status",
      value: "Closed",
    },
    {
      op: "replace",
      path: "/lastModified",
      value: {
        value: `${timestamp}`,
      },
    },
    {
      op: "replace",
      path: "/lastModifiedBy",
      value: {
        value: "TRINITY",
        schemeAgencyName: "TMCZ",
      },
    },
  ];
  return orderBody;
}

export async function serviceOrderFF(autoApprove: string) {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const idSO = incrementCounterOrderId();
  const idPrefix = process.env.ID_PREFIX || "PW";
  const orderBody = {
    id: [
      {
        value: `${idPrefix}_${idSO}`,
        schemeAgencyName: "TMCZ",
      },
    ],
    status: "New",
    type: "Activation",
    created: {
      value: `${timestamp}`,
    },
    createdBy: {
      value: "SMITH",
      schemeAgencyName: "TMCZ",
    },
    parts: {
      lineItem: [
        {
          id: [
            {
              value: "1",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "Create",
          serviceSpecification: [
            {
              id: [
                {
                  value: "WHSFTTHFLEXI",
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
          serviceSite: {
            contactPeople: [
              {
                contactPerson: {
                  individualName: {
                    title: "Ing.",
                    firstName: "John",
                    familyName: "Smith",
                  },
                  contactPoint: [
                    {
                      email: {
                        fullAddress: "j.smith@gmail.com",
                      },
                      telephone: {
                        subscriberNumber: "+420123456789",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: [
            {
              value: "2",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "Create",
          relatedLineItem: [
            {
              id: [
                {
                  value: "1",
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
          serviceSpecification: [
            {
              id: [
                {
                  value: "WHSFFSERVICE",
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
        },
        {
          id: [
            {
              value: "3",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "Create",
          relatedLineItem: [
            {
              id: [
                {
                  value: "2",
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
          serviceSpecification: [
            {
              id: [
                {
                  value: "WHSFFENDPOINT",
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
          serviceSite: {
            contactPeople: [
              {
                contactPerson: {
                  contactPoint: [
                    {
                      postal: {
                        geoLocation: {
                          latitudeMeasure: {
                            value: "50.2326897",
                          },
                          longitudeMeasure: {
                            value: "12.8765883",
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: [
            {
              value: "4",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "Create",
          relatedLineItem: [
            {
              id: [
                {
                  value: "2",
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
          serviceSpecification: [
            {
              id: [
                {
                  value: "WHSFFENDPOINT",
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
          serviceSite: {
            contactPeople: [
              {
                contactPerson: {
                  contactPoint: [
                    {
                      postal: {
                        geoLocation: {
                          latitudeMeasure: {
                            value: "49.2033786",
                          },
                          longitudeMeasure: {
                            value: "16.616550",
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: [
            {
              value: "5",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "Create",
          relatedLineItem: [
            {
              id: [
                {
                  value: "2",
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
          serviceSpecification: [
            {
              id: [
                {
                  value: "WHSFLEXIFIBER",
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "fiberSegmentID#1",
                  value: "DF0020",
                },
              ],
            },
          ],
        },
        {
          id: [
            {
              value: "6",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "Create",
          relatedLineItem: [
            {
              id: [
                {
                  value: "2",
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
          serviceSpecification: [
            {
              id: [
                {
                  value: "WHSFLEXIFIBER",
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "fiberSegmentID#1",
                  value: "DF0030",
                },
              ],
            },
          ],
        },
      ],
      note: [
        {
          content: `${autoApprove}`,
        },
      ],
    },
  };
  return orderBody;
}

export async function serviceOrderFFTermination(whsAssetId: string, tisServiceId: string) {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const idSO = incrementCounterOrderId();
  const idPrefix = process.env.ID_PREFIX || "PW";
  const orderBody = {
    "id": [
        {
            "value": `${idPrefix}_${idSO}`,
            "schemeAgencyName": "TMCZ"
        }
    ],
    "status": "New",
    "type": "Termination",
    "created": {
        "value": `${timestamp}`
    },
    "createdBy": {
        "value": "MORPHEUS",
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
                                "value": "WHSFTTHFLEXI",
                                "schemeAgencyName": "TMCZ"
                            }
                        ],
                        "characteristicsValue": [
                            {
                                "characteristicName": "whsAssetId",
                                "value": `${whsAssetId}`
                            },
                            {
                                "characteristicName": "tisServiceId",
                                "value": `${tisServiceId}`
                            }
                        ]
                    }
                ],
                "serviceSite": {
                    "contactPeople": [
                        {
                            "contactPerson": {
                                "individualName": {
                                    "title": "Ing.",
                                    "firstName": "John",
                                    "familyName": "Smith"
                                },
                                "contactPoint": [
                                    {
                                        "email": {
                                            "fullAddress": "j.smith@gmail.com"
                                        },
                                        "telephone": {
                                            "subscriberNumber": "+420123456789"
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ],
        "note": [
            {
                "content": "Poznámka"
            }
        ]
    }
  };
  return orderBody;
}

export async function serviceOrderFFModification(autoApprove: string, whsAssetId: string, whsAssetId_1: string, whsAssetId_2: string, whsAssetId_3: string, whsAssetId_4: string, whsAssetId_5: string,tisServiceId: string, fiberSegmentID_1: string, fiberSegmentID_2: string) {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const idSO = incrementCounterOrderId();
  const idPrefix = process.env.ID_PREFIX || "PW";
  const orderBody = {
    "id": [
        {
            "value": `${idPrefix}_${idSO}`,
            "schemeAgencyName": "TMCZ"
        }
    ],
    "status": "New",
    "type": "Modification",
    "created": {
        "value": `${timestamp}`
    },
    "createdBy": {
        "value": "MORPHEUS",
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
                                "value": "WHSFTTHFLEXI",
                                "schemeAgencyName": "TMCZ"
                            }
                        ],
                        "characteristicsValue": [
                            {
                                "characteristicName": "whsAssetId",
                                "value": `${whsAssetId}`
                            },
                            {
                                "characteristicName": "tisServiceId",
                                "value": `${tisServiceId}`
                            }
                        ]
                    }
                ],
                "serviceSite": {
                    "contactPeople": [
                        {
                            "contactPerson": {
                                "individualName": {
                                    "title": "Ing.",
                                    "firstName": "John",
                                    "familyName": "Smith"
                                },
                                "contactPoint": [
                                    {
                                        "email": {
                                            "fullAddress": "j.smith@gmail.com"
                                        },
                                        "telephone": {
                                            "subscriberNumber": "+420888999666"
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
                                "value": "WHSFFSERVICE",
                                "schemeAgencyName": "TMCZ"
                            }
                        ],
                        "characteristicsValue": [
                            {
                                "characteristicName": "whsAssetId",
                                "value": `${whsAssetId_1}`
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
                                "value": "WHSFFENDPOINT",
                                "schemeAgencyName": "TMCZ"
                            }
                        ],
                        "characteristicsValue": [
                            {
                                "characteristicName": "whsAssetId",
                                "value": `${whsAssetId_2}`
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
                                            "geoLocation": {
                                                "latitudeMeasure": {
                                                    "value": "50.2326897"
                                                },
                                                "longitudeMeasure": {
                                                    "value": "12.8765883"
                                                }
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
                        "value": "4",
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
                                "value": "WHSFFENDPOINT",
                                "schemeAgencyName": "TMCZ"
                            }
                        ],
                        "characteristicsValue": [
                            {
                                "characteristicName": "whsAssetId",
                                "value": `${whsAssetId_3}`
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
                                            "geoLocation": {
                                                "latitudeMeasure": {
                                                    "value": "49.2033786"
                                                },
                                                "longitudeMeasure": {
                                                    "value": "16.616550"
                                                }
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
                        "value": "5",
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
                                "value": "WHSFLEXIFIBER",
                                "schemeAgencyName": "TMCZ"
                            }
                        ],
                        "characteristicsValue": [
                            {
                                "characteristicName": "fiberSegmentID#1",
                                "value": `${fiberSegmentID_1}`
                            },
                            {
                                "characteristicName": "whsAssetId",
                                "value": `${whsAssetId_4}`
                            }
                        ]
                    }
                ]
            },
            {
                "id": [
                    {
                        "value": "6",
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
                                "value": "WHSFLEXIFIBER",
                                "schemeAgencyName": "TMCZ"
                            }
                        ],
                        "characteristicsValue": [
                            {
                                "characteristicName": "fiberSegmentID#1",
                                "value": `${fiberSegmentID_2}`
                            },
                            {
                                "characteristicName": "whsAssetId",
                                "value": `${whsAssetId_5}`
                            }
                        ]
                    }
                ]
            },
            {
                "id": [
                    {
                        "value": "7",
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
                                "value": "WHSFLEXIFIBER",
                                "schemeAgencyName": "TMCZ"
                            }
                        ],
                        "characteristicsValue": [
                            {
                                "characteristicName": "fiberSegmentID#1",
                                "value": "DF0221"
                            }
                        ]
                    }
                ]
            },
            {
                "id": [
                    {
                        "value": "8",
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
                                "value": "WHSFLEXIFIBER",
                                "schemeAgencyName": "TMCZ"
                            }
                        ],
                        "characteristicsValue": [
                            {
                                "characteristicName": "fiberSegmentID#1",
                                "value": "DF0336"
                            }
                        ]
                    }
                ]
            }
        ],
        "note": [
            {
                "content": `${autoApprove}`
            }
        ]
    }
  };
  return orderBody;
}