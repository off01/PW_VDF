import { incrementCounterTroubleticketId } from "@helper/counterHelper";
import { randomTextGenerator } from "@helper/randomGenerator";
import moment from "moment";

export async function createServisProblemOrderBody(idASSET_ser: string, category: string) {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const idTT = incrementCounterTroubleticketId();
  const idPrefix = process.env.ID_PREFIX || "PW";
  const orderBody = {
    id: [
      {
        value: `${idPrefix}_${idTT}`,
        schemeAgencyName: "TMCZ",
      },
    ],
    desc: randomTextGenerator(15),
    type: "TroubleTicket",
    category: [
      {
        value: `${category}`, //FTTHCoreNetwork
      },
    ],
    status: "New",
    created: {
      value: `${timestamp}`,
    },
    createdBy: {
      value: "KEYMAKER",
      schemeAgencyName: "TMCZ",
    },
    details: {
      priorityCode: "4",
    },
    parts: {
      service: [
        {
          id: [
            {
              value: `${idASSET_ser}`,
              schemeAgencyName: "VFCZ",
            },
          ],
        },
      ],
      workLog: {
        workInfo: [
          {
            id: [
              {
                value: "1",
                schemeAgencyName: "VFCZ",
              },
            ],
            status: "New",
            type: "General Information",
            text: randomTextGenerator(100),
            loggedDateTime: {
              value: `${timestamp}`,
            },
          },
        ],
      },
      attachment: [
        {
          id: [
            {
              value: "1",
              schemeAgencyName: "VFCZ",
            },
          ],
          status: "New",
          binaryObject: {
            value: "jm==",
            fileName: "IMG_20230821_091532.jpg",
          },
        },
      ],
    },
  };
  return orderBody;
}
