/**
 * Asynchronous function that checks if the response has the expected status code.
 * If the status code is not equal to the expected status code, the function generates and throws an error,
 * which includes the body of the response.
 *
 * @param {any} response - Odpověď ke kontrole.
 * @param {number} expectedStatus - Očekávaný stavový kód.
 */

export async function checkResponseStatus(response: any, expectedStatus: number) {
    if (response.status() !== expectedStatus) {
        const body = await response.json();
        throw new Error(`Expected status ${expectedStatus} but received ${response.status()}. Response body: ${JSON.stringify(body, null, 2)}`);
    }
}

/**
 * Scans the object and checks if it contains `null` values.
 * The function traverses all keys of the object and recursively checks nested objects.
 * If a `null` value is found, the function returns `true`. If no `null` values are found,
 * the function returns `false`.
 *
 * @param {any} obj - Objekt ke kontrole.
 * @returns {boolean} - Vrací `true`, pokud objekt nebo jeho vnořené objekty obsahují hodnotu `null`, jinak `false`.
 */

export function checkForNullValues(obj: any): boolean {
    for (let key in obj) {
        if (obj[key] === null) {
            return true;
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (checkForNullValues(obj[key])) {
                return true;
            }
        }
    }
    return false;
}

