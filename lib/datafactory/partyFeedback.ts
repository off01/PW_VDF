import { incrementCounterservicePartyId } from "../helper/counterHelper";
import moment from "moment";

export async function questionaryL1(idWHS_PFS: string, idWHS_SO: string) {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const idPF = incrementCounterservicePartyId();
  let orderBody = {
    id: [
      {
        value: `PF_${idPF}`,
        schemeAgencyName: "TMCZ",
      },
    ],
    status: "AnswersProvided",
    created: {
      value: `${timestamp}`,
    },
    createdBy: {
      value: "JASOBOUR",
      schemeAgencyName: "TMCZ",
    },
    parts: {
      relatedObject: [
        {
          id: [
            {
              value: `${idWHS_SO}`,
              schemeAgencyName: "VFCZ",
            },
          ],
          type: "ServiceOrder",
        },
      ],
      partyFeedbackSpecification: {
        id: [
          {
            value: `${idWHS_PFS}`,
            schemeAgencyName: "VFCZ",
          },
        ],
      },
      question: [
        {
          id: [
            {
              value: "1",
              schemeAgencyName: "VFCZ",
            },
          ],
          desc: "Má zákazník v bytě zásuvku pro kabelový internet?",
          type: "multipleChoice",
          questionResponse: ["Ano", "Ne"],
          consumerResponse: "Ano",
        },
        {
          id: [
            {
              value: "2",
              schemeAgencyName: "VFCZ",
            },
          ],
          desc: "Požaduje zákazník jiné práce, které provádí instalační firma dle svého ceníku? Například lištování, úpravu kabeláže, dodání bytového zesilovače.",
          type: "multipleChoice",
          questionResponse: ["Ano", "Ne"],
          consumerResponse: "Ne",
        },
        {
          id: [
            {
              value: "3",
              schemeAgencyName: "VFCZ",
            },
          ],
          desc: "Informace pro technika",
          type: "freeText",
          consumerResponse: "Pozor zlý pes",
        },
      ],
    },
  };
  return orderBody;
}
