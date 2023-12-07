// lib/helper/xmlParser.js

import { parseStringPromise } from 'xml2js';


/**
 * Converts an XML string to a JavaScript object.
 * 
 * This function uses the xml2js library to transform an XML string into an object.
 * If an error occurs during parsing, it prints an error to the console and throws an exception.
 * 
 * @param {string} xml - XML řetězec, který má být převeden.
 * @returns {Promise<object>} Promise, která po úspěšném zpracování vrátí JavaScriptový objekt.
 * 
 * @example
 * const xmlString = `<your-xml-here>`;
 * const xmlObject = await parseXml(xmlString);
 * console.log(xmlObject); // Vypíše převedený JavaScriptový objekt.
 */
export async function parseXml(xml) {
  try {
    const result = await parseStringPromise(xml, { explicitArray: false });
    return result;
  } catch (err) {
    console.error('Chyba při parsování XML:', err);
    throw err;
  }
}
