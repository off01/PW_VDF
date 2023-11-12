import moment from "moment";

export async function serviceSuspend() {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const orderBody = [
    {
      op: "test",
      path: "/status",
      value: "Active",
    },
    {
      op: "replace",
      path: "/status",
      value: "Suspend",
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
        value: "JOHNDEPP",
        schemeAgencyName: "TMCZ",
      },
    },
  ];
  return orderBody;
}

export async function serviceResume() {
  const timestamp = moment().utcOffset(1).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const orderBody = [
    {
      op: "test",
      path: "/status",
      value: "Suspend",
    },
    {
      op: "replace",
      path: "/status",
      value: "Active",
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
        value: "JASOBOUR",
        schemeAgencyName: "TMCZ",
      },
    },
  ];
  return orderBody;
}
