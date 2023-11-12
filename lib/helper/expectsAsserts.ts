import { createJsonSchema } from "@helper/schemaHelperFunctions";
import { expect } from "@playwright/test";
import Ajv from "ajv";

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
    throw new Error(
      `Expected status ${expectedStatus} but received ${response.status()}. Response body: ${JSON.stringify(
        body,
        null,
        2
      )}`
    );
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
  for (const key in obj) {
    if (obj[key] === null) {
      return true;
    }
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (checkForNullValues(obj[key])) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Validates an object against a JSON schema.
 *
 * @param {string} fileName - První část názvu souboru se schématem JSON. Celý název bude `${jméno souboru}_schema.json`.
 * @param {string} filePath - Cesta k adresáři obsahujícímu soubor se schématem JSON.
 * @param {object} body - Objekt, který se ověřuje podle schématu JSON.
 * @param {boolean} [createSchema=false] - Zda vytvořit schéma JSON, pokud neexistuje.
 *
 * @example
 *    const body = await response.json();
 *
 *    // This will run the assertion against the existing schema file
 *    await validateJsonSchema("POST_booking", "booking", body);
 *
 *    // This will create or overwrite the schema file
 *    await validateJsonSchema("POST_booking", "booking", body, true);
 */
export async function validateJsonSchema(fileName: string, filePath: string, body: object, createSchema = false) {
  const jsonName = fileName;
  const path = filePath;

  if (createSchema) {
    await createJsonSchema(jsonName, path, body);
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const existingSchema = require(`../../.api/${path}/${jsonName}_schema.json`);

  const ajv = new Ajv({ allErrors: false });
  const validate = ajv.compile(existingSchema);
  const validRes = validate(body);

  if (!validRes) {
    console.log("SCHEMA ERRORS:", JSON.stringify(validate.errors), "\nRESPONSE BODY:", JSON.stringify(body));
  }

  expect(validRes).toBe(true);
}