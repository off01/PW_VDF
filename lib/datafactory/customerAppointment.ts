import { incrementCounterServiceCustomerAppointmentId } from "@helper/counterHelper";
import moment from "moment";

export async function customerAppointmentL1(idWHS_WAS: string) {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const idCA = incrementCounterServiceCustomerAppointmentId();
  const orderBody = {
    id: [
      {
        value: `CA_${idCA}`,
        schemeAgencyName: "TMCZ",
      },
    ],
    type: "ServiceOrder",
    status: "New",
    created: {
      value: `${timestamp}`,
    },
    createdBy: {
      value: "JASOBOUR",
      schemeAgencyName: "TMCZ",
    },
    workforceAppointmentSlot: {
      id: [
        {
          value: `${idWHS_WAS}`,
          schemeAgencyName: "VFCZ",
        },
      ],
    },
  };
  return orderBody;
}
