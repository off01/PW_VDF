// LocationFlatIds (L3)

export function getLocationFlatIdsWithCondition(body: any): string[] {
  return body.parts.lineItem
    .filter((item: any) => {
      const characteristics = item.serviceSpecification[0]?.specification?.characteristicsValue || [];
      return characteristics.some((char: any) => char.characteristicName === "socketInstalled" && char.value === "N");
    })
    .map((item: any) => {
      const characteristics = item.locations[0]?.characteristic?.characteristicsValue || [];
      const locationFlatIdChar = characteristics.find((char: any) => char.characteristicName === "locationFlatId");
      return locationFlatIdChar?.value;
    })
    .filter(Boolean);
}

// WHS_WAS ids (L1)

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

export function getRandomElement(arr: any[]): any {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
