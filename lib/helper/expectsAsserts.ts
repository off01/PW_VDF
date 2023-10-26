export async function checkResponseStatus(response: any, expectedStatus: number) {
    if (response.status() !== expectedStatus) {
        const body = await response.json();
        throw new Error(`Expected status ${expectedStatus} but received ${response.status()}. Response body: ${JSON.stringify(body, null, 2)}`);
    }
}
