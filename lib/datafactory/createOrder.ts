import { incrementCounterOrderId } from "@helper/counterHelper";
import moment from "moment";

export async function createActivationL3OrderBody(WHSDATA: string, WHSHW: string) {
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
      value: "TRINITY",
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
                  value: "WHSFTTHCONN",
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
                        characteristic: {
                          characteristicsValue: [
                            {
                              characteristicName: "buildingId",
                              value: "1026629", // Natvrdo daný - chtělo by to parametrizovanou úpravu
                            },
                          ],
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
                  value: "WHSFBBSERVICE",
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
                  value: `${WHSDATA}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
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
                  value: `${WHSHW}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
        },
      ],
      note: [
        {
          content: "Optional information",
        },
      ],
    },
  };
  return orderBody;
}

export async function createActivationL1OrderBody(WHSDATA: string, WHSHW: string) {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const idSO = incrementCounterOrderId();
  const idPrefix = process.env.ID_PREFIX || "PW";
  const orderBody = {
    id: [
      {
        value: `${idPrefix}_${idSO}`, //JM -- defaultně dle kuchařky 'SO'
        schemeAgencyName: "TMCZ",
      },
    ],
    status: "New",
    type: "Activation",
    created: {
      value: `${timestamp}`,
    },
    createdBy: {
      value: "JASOBOUR",
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
                  value: "WHSHFCCONN",
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
                  language: "CZ",
                  contactPoint: [
                    {
                      email: {
                        fullAddress: "j.smith@gmail.com",
                      },
                      telephone: {
                        subscriberNumber: "+420123456789",
                      },
                      postal: {
                        characteristic: {
                          characteristicsValue: [
                            {
                              characteristicName: "locationFlatId",
                              value: "1991951",
                            },
                            {
                              characteristicName: "buildingId",
                              value: "358913",
                            },
                          ],
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
                  value: "WHSFBBSERVICE",
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
                  value: `${WHSDATA}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
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
                  value: `${WHSHW}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
        },
      ],
      note: [
        {
          content: "Optional information",
        },
      ],
    },
  };
  return orderBody;
}

export async function createModificationChangeTariffL1OrderBody(
  idASSET_sub: string,
  idASSET_ser: string,
  WHSDATA: string,
  idASSET_ass1: string,
  WHSHW_OG: string,
  idASSET_ass2: string,
  macAddress: string,
  WHSHW: string
) {
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
    type: "Modification",
    created: {
      value: `${timestamp}`,
    },
    createdBy: {
      value: "JASOBOUR",
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
          action: "NoChange",
          serviceSpecification: [
            {
              id: [
                {
                  value: "WHSHFCCONN",
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_sub}`,
                },
              ],
            },
          ],
        },
        {
          id: [
            {
              value: "2",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "NoChange",
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
                  value: "WHSFBBSERVICE",
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_ser}`,
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
          action: "Delete",
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
                  value: `${WHSDATA}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_ass1}`,
                },
              ],
            },
          ],
        },
        {
          id: [
            {
              value: "4",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "NoChange",
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
                  value: `${WHSHW_OG}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_ass2}`,
                },
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
          ],
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
                  value: `${WHSHW}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
        },
      ],
      note: [
        {
          content: "Optional information",
        },
      ],
    },
  };
  return orderBody;
}

export async function createModificationSwapHWL1OrderBody(
  idASSET_sub: string,
  idASSET_ser: string,
  WHSDATA: string,
  idASSET_ass1: string,
  WHSHW_OG: string,
  idASSET_ass2: string,
  macAddress: string,
  WHSHW: string
) {
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
    type: "Modification",
    created: {
      value: `${timestamp}`,
    },
    createdBy: {
      value: "JASOBOUR",
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
          action: "NoChange",
          serviceSpecification: [
            {
              id: [
                {
                  value: "WHSHFCCONN",
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_sub}`,
                },
              ],
            },
          ],
        },
        {
          id: [
            {
              value: "2",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "NoChange",
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
                  value: "WHSFBBSERVICE",
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_ser}`,
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
          action: "NoChange",
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
                  value: `${WHSDATA}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_ass1}`,
                },
              ],
            },
          ],
        },
        {
          id: [
            {
              value: "4",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "Delete",
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
                  value: `${WHSHW_OG}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_ass2}`,
                },
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
          ],
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
                  value: `${WHSHW}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
        },
      ],
      note: [
        {
          content: "Optional information",
        },
      ],
    },
  };
  return orderBody;
}

export async function createModificationSwapHWL3OrderBody(
  idASSET_sub: string,
  idASSET_ser: string,
  WHSDATA: string,
  idASSET_ass1: string,
  WHSHW_OG: string,
  idASSET_ass2: string,
  randomrsnNumber_OG: string,
  randomrid_OG: string,
  WHSHW: string
) {
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
    type: "Modification",
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
          action: "NoChange",
          serviceSpecification: [
            {
              id: [
                {
                  value: "WHSFTTHCONN",
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_sub}`,
                },
              ],
            },
          ],
        },
        {
          id: [
            {
              value: "2",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "NoChange",
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
                  value: "WHSFBBSERVICE",
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_ser}`,
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
          action: "NoChange",
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
                  value: `${WHSDATA}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_ass1}`,
                },
              ],
            },
          ],
        },
        {
          id: [
            {
              value: "4",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "Delete",
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
                  value: `${WHSHW_OG}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_ass2}`,
                },
                {
                  characteristicName: "snNumber",
                  value: `${randomrsnNumber_OG}`,
                },
                {
                  characteristicName: "hwType",
                  value: "Raisecom ISCOM HT803G-07",
                },
                {
                  characteristicName: "rid",
                  value: `${randomrid_OG}`,
                },
              ],
            },
          ],
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
                  value: `${WHSHW}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
        },
      ],
      note: [
        {
          content: "Optional information",
        },
      ],
    },
  };
  return orderBody;
}

export async function createTerminationL3OrderBody(idASSET_sub: string) {
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
    type: "Termination",
    created: {
      value: `${timestamp}`,
    },
    createdBy: {
      value: "TRINITY",
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
          action: "Delete",
          serviceSpecification: [
            {
              id: [
                {
                  value: "WHSFTTHCONN",
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_sub}`,
                },
              ],
            },
          ],
        },
      ],
      note: [
        {
          content: "Optional information",
        },
      ],
    },
  };
  return orderBody;
}

export async function createTerminationL1OrderBody(idASSET_sub: string) {
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
    type: "Termination",
    created: {
      value: `${timestamp}`,
    },
    createdBy: {
      value: "JASOBOUR",
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
          action: "Delete",
          serviceSpecification: [
            {
              id: [
                {
                  value: "WHSHFCCONN",
                  schemeAgencyName: "TMCZ",
                },
              ],
              characteristicsValue: [
                {
                  characteristicName: "whsAssetId",
                  value: `${idASSET_sub}`,
                },
              ],
            },
          ],
        },
      ],
      note: [
        {
          content: "Optional information",
        },
      ],
    },
  };
  return orderBody;
}

export async function createPortationL1OrderBody(mopid: string, WHSDATA: string, WHSHW: string) {
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
    type: "Portation",
    created: {
      value: `${timestamp}`,
    },
    createdBy: {
      value: "JASOBOUR",
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
          action: "Portation",
          serviceSpecification: [
            {
              id: [
                {
                  value: "WHSHFCCONN",
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
                        characteristic: {
                          characteristicsValue: [
                            {
                              characteristicName: "mopid",
                              value: `${mopid}`,
                            },
                          ],
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
              value: "2",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "Portation",
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
                  value: "WHSFBBSERVICE",
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
          action: "Portation",
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
                  value: `${WHSDATA}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
        },
        {
          id: [
            {
              value: "4",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "Portation",
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
                  value: `${WHSHW}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
        },
      ],
    },
  };
  return orderBody;
}

export async function createPortationL3OrderBody(mopid: string, WHSDATA: string, WHSHW: string) {
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
    type: "Portation",
    created: {
      value: `${timestamp}`,
    },
    createdBy: {
      value: "NEO",
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
          action: "Portation",
          serviceSpecification: [
            {
              id: [
                {
                  value: "WHSFTTHCONN",
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
                        characteristic: {
                          characteristicsValue: [
                            {
                              characteristicName: "mopid",
                              value: `${mopid}`,
                            },
                          ],
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
              value: "2",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "Portation",
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
                  value: "WHSFBBSERVICE",
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
          action: "Portation",
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
                  value: `${WHSDATA}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
        },
        {
          id: [
            {
              value: "4",
              schemeAgencyName: "TMCZ",
            },
          ],
          status: "New",
          action: "Portation",
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
                  value: `${WHSHW}`,
                  schemeAgencyName: "TMCZ",
                },
              ],
            },
          ],
        },
      ],
      note: [
        {
          content: "Optional information",
        },
      ],
    },
  };
  return orderBody;
}
