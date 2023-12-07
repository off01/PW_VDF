export async function getLocationFlatList(idbuildingId: string, idWHS_SO: string) {
  const requestBody = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:head="http://www.vodafone.cz/Common/xml/Header" xmlns:v1="http://www.vodafone.cz/WhsApi/ResourceInterface/v1_0" xmlns:v11="http://www.vodafone.cz/WhsApi/Type/v1_0">
    <soap:Header>
        <head:vfHeader>
            <head:traceIdentifier>
                <head:applicationId>?</head:applicationId>
                <head:serviceId>?</head:serviceId>
                <head:serviceInterfaceVersion>?</head:serviceInterfaceVersion>
                <head:identityId>?</head:identityId>
            </head:traceIdentifier>
        </head:vfHeader>
    </soap:Header>
    <soap:Body>
        <v1:getLocationFlatListRequest>
            <v11:partnerCode>TMCZ</v11:partnerCode>
            <v11:whsServiceOrderId>${idWHS_SO}</v11:whsServiceOrderId>
            <v11:buildingId>${idbuildingId}</v11:buildingId>
        </v1:getLocationFlatListRequest>
    </soap:Body>
    </soap:Envelope>`;

  const headers = {
    "Content-Type": "text/xml; charset=utf-8",
    SOAPAction: "/WhsApiResource/GetLocationFlatList",
  };

  return { body: requestBody, headers: headers };
}
