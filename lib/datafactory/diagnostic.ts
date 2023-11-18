import { incrementCounterDiagnosticId } from "@helper/counterHelper";

export async function diagnosticL3(whsServiceId: string) {
  const idDiagnostic = incrementCounterDiagnosticId();
  const orderBody = {
    id: `D_${idDiagnostic}`,
    type: "Diagnostics",
    relatedEntity: [
      {
        id: whsServiceId, // Na hulváta zadaný platný whsServiceId 80016090
        name: "whsServiceId",
      },
    ],
  };
  return orderBody;
}
