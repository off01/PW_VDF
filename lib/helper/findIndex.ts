export function findIndexOfWHSHWONT(response: any): number {
    return response.parts.lineItem.findIndex(item => 
        item.serviceSpecification.some(spec => 
            spec.id.some(idObj => 
                idObj.schemeAgencyName === "TMCZ" && idObj.value === "WHSHWONT"
            )
        )
    );
}