import { createSchema } from "genson-js";
import * as fs from "fs/promises";

/**
 * Asynchronously creates a JSON schema from the provided JSON object and saves it to a file.
 *
 * The function first creates a directory (if it doesn't already exist) at the specified `path`.
 * It then generates a JSON schema from the given JSON object, serializes it to a string with
 * indentation for readability, and writes it to a file with a name based on the `name` argument
 * in a subdirectory under `.api/`.
 *
 * @param {string} name - Název, který se použije jako součást názvu souboru pro uložené schéma.
 * @param {string} path - Cesta (relativní vůči adresáři `.api/`), kam bude soubor se schématem uložen.
 * @param {object} json - Objekt JSON, pro který se má vygenerovat schéma JSON.
 * @returns {Promise<void>} Soubor se schématem byl úspěšně vytvořen a uložen.
 * @throws {Error} Vyhodí chybu, pokud dojde k problému při vytváření nebo zápisu souboru.
 */

export async function createJsonSchema(name: string, path: string, json: object) {
  const filePath = `./.api/${path}`;

  try {
    await fs.mkdir(filePath, { recursive: true });

    const schema = createSchema(json);
    const schemaString = JSON.stringify(schema, null, 2);
    const schemaName = `.api/${path}/${name}_schema.json`;

    await writeJsonFile(schemaName, schemaString);

    console.log("JSON Schema created and saved.");
  } catch (err) {
    console.error(err);
  }
}

/**
 * Asynchronously writes data to a JSON file at the specified location.
 * If an error occurs during writing, the error is logged to the console.
 *
 * @async
 * @function writeJsonFile
 * @param {string} location - Cesta k souboru, do kterého se mají data zapsat.
 * @param {string} data - Řetězec obsahující data, která mají být zapsána do souboru.
 * @returns {Promise<void>} Promise, která se vyřeší, jakmile je zápis do souboru dokončen.
 * @throws {Error} Pokud dojde k chybě při zápisu do souboru.
 */

async function writeJsonFile(location: string, data: string) {
  try {
    await fs.writeFile(location, data);
  } catch (err) {
    console.error(err);
  }
}
