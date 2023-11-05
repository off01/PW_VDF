export async function waitForExpectedStatus(request, expectedStatus, id, maxRetries = 10, retryInterval = 1000) {
    let currentRetry = 0;
    let body;

    while (currentRetry < maxRetries) {
        const response = await request.get(`/serviceOrderAPI/v2/serviceOrder/${id}`);
        if (response.status() !== 200) {
            throw new Error(`Expected status 200 but got ${response.status()}`);
        }
        body = await response.json();
        if (body.status === expectedStatus) {
            return body; // Vrátí tělo odpovědi, když je stav správný.
        }
        currentRetry++;
        await new Promise(r => setTimeout(r, retryInterval));
    }
    throw new Error(`Expected status '${expectedStatus}' but got '${body.status}' after ${maxRetries} retries.`);
}
