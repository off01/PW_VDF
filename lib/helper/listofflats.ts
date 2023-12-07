// LocationFlatIds (L3)

/**
 * Gets the housing unit ID field with the specific condition from the provided object.
 *
 * This function scans the lineItem field in the message body for items that meet a specific criterion.
 * Specifically, it looks for items where the characteristicName 'socketInstalled' has the value 'N'.
 * For these items, it then extracts the 'locationFlatId' value from their locations.
 *
 * @param {any} body - Objekt, který obsahuje pole lineItem a další související data.
 * @returns {string[]} Pole řetězců obsahujících ID bytových jednotek, které splňují zadané kritérium.
 *                     Pokud nejsou nalezeny žádné odpovídající položky, vrátí prázdné pole.
 * @throws {TypeError} Pokud je struktura objektu 'body' neplatná nebo neobsahuje očekávaná data,
 *                     může dojít k chybě při pokusu o přístup k neexistujícím vlastnostem.
 */

export function getLocationFlatIdsWithCondition(body: any): string[] {
  return body.parts.lineItem
    .filter((item: any) => {
      const characteristics = item.serviceSpecification[0]?.specification?.characteristicsValue || [];
      return characteristics.some((char: any) => char.characteristicName === "socketInstalled" && char.value === "Y");
    })
    .map((item: any) => {
      const characteristics = item.locations[0]?.characteristic?.characteristicsValue || [];
      const locationFlatIdChar = characteristics.find((char: any) => char.characteristicName === "locationFlatId");
      return locationFlatIdChar?.value;
    })
    .filter(Boolean);
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
