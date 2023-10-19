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

export function getRandomElement(arr: any[]): any {
    let randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}
