import fs from "fs";
import path from "path";
import config from "../../config/config";

/**
 * Increments a specific counter in the counter file.
 *
 * @param {string} counterKey - Klíč čítače, který má být inkrementován. 
 * Měl by odpovídat vlastnosti v souboru čítače.
 * 
 * @returns {number} Nová hodnota čítače po inkrementaci.
 *
 * @description
 * This function reads the current state of counters from a JSON file,
 * increments the value of the specified counter, and then writes the updated
 * state back to the file. It is designed to work with a specific structure
 * of JSON file where each key represents a different counter.
 *
 * @example
 * // To increment the 'diagnosticId' counter
 * incrementCounter('diagnosticId');
 */

const counterFilePath = path.join(__dirname, `../../config/${config.currentEnv}/counter.json`);

function incrementCounter(counterKey: string): number {
  const data = JSON.parse(fs.readFileSync(counterFilePath, "utf-8"));
  const newCounter = data[counterKey] + 1;
  data[counterKey] = newCounter;
  fs.writeFileSync(counterFilePath, JSON.stringify(data, null, 2));
  return newCounter;
}

export const incrementCounterDiagnosticId = () => incrementCounter("diagnosticId");
export const incrementCounterOrderId = () => incrementCounter("idSO");
export const incrementCounterServiceFeasibilityId = () => incrementCounter("idSF");
export const incrementCounterServicePartyId = () => incrementCounter("idPF");
export const incrementCounterServiceCustomerAppointmentId = () => incrementCounter("idCA");
