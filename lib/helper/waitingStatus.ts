/**
 * Repeatedly checks the status of the order and waits for the expected status.
 *
 * This asynchronous function repeatedly sends an HTTP GET request to the specified URL
 * (via the passed request object) to obtain the status of the order.
 * The function attempts to retrieve the expected status in the specified number of attempts and between attempts
 * waits for a fixed interval.
 *
 * @param {object} request - Objekt, který umožňuje vysílat HTTP požadavky.
 * @param {string} expectedStatus - Očekávaný status objednávky, na který funkce čeká.
 * @param {string} id - Identifikátor objednávky, pro kterou se kontroluje status.
 * @param {number} [maxRetries=10] - Maximální počet pokusů pro kontrolu statusu.
 * @param {number} [retryInterval=1000] - Interval mezi pokusy v milisekundách.
 * @returns {Promise<object>} Promise, který se vyřeší s tělem odpovědi, pokud byl
 *                            dosažen očekávaný status.
 * @throws {Error} Vyhodí chybu, pokud odpověď od serveru není status 200, nebo pokud
 *                 není dosaženo očekávaného statusu po maximálním počtu pokusů.
 */

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
    await new Promise((r) => setTimeout(r, retryInterval));
  }
  throw new Error(`Expected status '${expectedStatus}' but got '${body.status}' after ${maxRetries} retries.`);
}
