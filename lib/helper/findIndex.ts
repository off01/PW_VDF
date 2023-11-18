/**
 * Searches for the index of the first item in `lineItem` that matches the specified criteria.
 *
 * @param {any} response - Objekt odpovědi, ve kterém se hledá.
 * @param {string} valueToFind - Hodnota 'value', kterou chceme najít (WHSFTTHCONN,WHSHFCCONN).
 * @returns {number} Index prvku, který odpovídá kritériím; -1, pokud není nalezen.
 */
export function findIndexOfSpecificValue(response: any, valueToFind: string): number {
  return response.parts.lineItem.findIndex((item) =>
    item.serviceSpecification.some((spec) =>
      spec.id.some((idObj) => idObj.schemeAgencyName === "TMCZ" && idObj.value === valueToFind)
    )
  );
}
