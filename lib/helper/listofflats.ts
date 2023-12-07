// LocationFlatIds (L3)

/**
 * Extracts and returns a list of byte IDs that meet specific conditions from the output of a SOAP call.
 *
 * @param {object} parsedXml - Vyparsovaný XML objekt z SOAP odpovědi.
 * @returns {string[]} Seznam ID bytů, které splňují podmínky (socketInstalled je 'true' a serviceActive je 'false').
 *
 * @example
 * const parsedXml = await parseXml(responseBodyText);
 * const locationFlatIds = getLocationFlatIdsWithCondition2(parsedXml);
 * console.log(locationFlatIds); // Vypíše ID bytů, které splňují podmínky.
 */

export function getLocationFlatIdsWithCondition(parsedXml) {
  const flats = parsedXml["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns0:getLocationFlatListResponse"]["ns1:flats"]["ns1:flat"];
  // Filtrujte pouze ty byty, které splňují dané podmínky
  const filteredFlats = flats.filter(flat => 
    flat["ns1:socketInstalled"] === 'true' && flat["ns1:serviceActive"] === 'false'
  );
  // Extrahujte 'locationFlatId' z vyhovujících bytů
  const locationFlatIds = filteredFlats.map(flat => flat["ns1:locationFlatId"]);
  return locationFlatIds;
}


// WHS_WAS ids (L1)

/**
 * Extracts and returns unique values starting with "WHS_WAS" from the given response.
 *
 * This function scans the array of objects (expected in the 'response' parameter) and searches them
 * values starting with the string "WHS_WAS". It collects these values into an array and provides,
 * that each value is in the array only once.
 *
 * @param {any[]} response - Pole objektů, ve kterých se hledají hodnoty. Každý objekt by
 *                           měl mít vlastnost 'id', která je polem objektů s vlastností 'value'.
 * @returns {string[]} Pole řetězců, které obsahuje unikátní hodnoty začínající na "WHS_WAS".
 */

export function extractWHSWAS(response: any): string[] {
  const WHSWASValues: string[] = [];

  response.forEach((item: any) => {
    item.id.forEach((idItem: any) => {
      const value = idItem.value;
      if (value.startsWith("WHS_WAS")) {
        //console.log(value);  // Vypíše hodnotu na konzoli
        if (!WHSWASValues.includes(value)) {
          WHSWASValues.push(value); // Uloží hodnotu do pole, pokud již není uložena
        }
      }
    });
  });

  return WHSWASValues; // Vrátí pole s hodnotami WHS_WAS
}

/**
 * Returns a randomly selected element from the array.
 *
 * @param {any[]} arr - Pole libovolných prvků, ze kterého má být prvek vybrán.
 * @returns {any} Náhodně vybraný prvek z pole. Může vrátit `undefined`, pokud je pole prázdné.
 */

export function getRandomElement(arr: any[]): any {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
