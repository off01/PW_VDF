import * as fs from "fs";
import * as path from "path";

/**
 * Function to record the results in a JSON file.
 *
 * @param idWHS_SO ID WHS SO.
 * @param idASSET_ser ID ASSET ser.
 * @param hwProfile Profile name.
 * @param filePath Relativní cesta k souboru JSON z kořenového adresáře projektu. Výchozí hodnota je 'results/results.json'.
 */
export async function recordResults(
  idWHS_SO: string,
  idASSET_ser: string,
  hwProfile: string,
  filePath = "results/results.json"
): Promise<void> {
  // Absolutní cesta k souboru JSON
  const absolutePath = path.resolve(__dirname, "../../", filePath);

  // Data k zaznamenání
  const data = {
    idWHS_SO,
    idASSET_ser,
    hwProfile
  };

  // Převedení dat na řetězec JSON a přidání na konec souboru
  await appendToJson(absolutePath, data);
}

/**
 * Function for adding data to JSON file.
 *
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
