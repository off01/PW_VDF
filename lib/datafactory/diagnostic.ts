import { incrementCounterDiagnosticId } from "@helper/counterHelper";

export async function diagnosticL3() {
  const idDiagnostic = incrementCounterDiagnosticId();
  const orderBody = {
    id: `D_${idDiagnostic}`,
    type: "Diagnostics",
    relatedEntity: [
      {
        id: "80016090", // Na hulváta zadaný platný whsServiceId
        name: "whsServiceId",
      },
    ],
  };
  return orderBody;
}

export async function diagnosticL3InvalidwhsServiceId() {
  const idDiagnostic = incrementCounterDiagnosticId();
  const orderBody = {
    id: `D_${idDiagnostic}`,
    type: "Diagnostics",
    relatedEntity: [
      {
        id: "AA", // Neplatné whsServiceId
        name: "whsServiceId",
      },
    ],
  };
  return orderBody;
}
