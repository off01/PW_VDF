import * as fs from "fs";
import * as path from "path";

/**
 * Funkce pro zaznamenání výsledků do souboru JSON.
 * @param idWHS_SO ID WHS SO.
 * @param idASSET_ser ID ASSET ser.
 * @param filePath Relativní cesta k souboru JSON z kořenového adresáře projektu. Výchozí hodnota je 'results/results.json'.
 */
export async function recordResults(
  idWHS_SO: string,
  idASSET_ser: string,
  filePath: string = "results/results.json"
): Promise<void> {
  // Absolutní cesta k souboru JSON
  const absolutePath = path.resolve(__dirname, "../../", filePath);

  // Data k zaznamenání
  const data = {
    idWHS_SO,
    idASSET_ser,
  };

  // Převedení dat na řetězec JSON a přidání na konec souboru
  await appendToJson(absolutePath, data);
}

/**
 * Funkce pro přidání dat do souboru JSON.
 * @param filepath Absolutní cesta k souboru JSON.
 * @param data Data k přidání do souboru JSON.
 */
export async function appendToJson(filepath: string, data: { idWHS_SO: string; idASSET_ser: string }): Promise<void> {
  // Kontrola, zda soubor již existuje
  const fileExists = fs.existsSync(filepath);

  // Čtení existujících dat ze souboru, pokud existuje
  let existingData: { idWHS_SO: string; idASSET_ser: string }[] = [];
  if (fileExists) {
    const fileContent = await fs.promises.readFile(filepath, "utf-8");
    existingData = JSON.parse(fileContent);
  }

  // Přidání nových dat k existujícím datům
  existingData.push(data);

  // Zápis aktualizovaných dat zpět do souboru
  await fs.promises.writeFile(filepath, JSON.stringify(existingData, null, 2));
}

export async function getTestCases(filePath: string): Promise<string[]> {
  const absoluteFilePath = path.resolve(__dirname, "../../", filePath);
  if (!fs.existsSync(absoluteFilePath)) {
    throw new Error(`File ${absoluteFilePath} does not exist.`);
  }

  const content = fs.readFileSync(absoluteFilePath, "utf8");
  const records = JSON.parse(content);

  if (!Array.isArray(records)) {
    throw new Error(`The file content is not an array of objects.`);
  }

  return records.map((record: { idWHS_SO: string }) => record.idWHS_SO);
}
