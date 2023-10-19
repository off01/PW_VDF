import fs from "fs";
import path from "path";

const counterFilePath = path.join(__dirname, 'counter.json');

export function incrementCounterDiagnosticId(): number {
    const data = JSON.parse(fs.readFileSync(counterFilePath, 'utf-8'));
    const newCounter = data.diagnosticId + 1;
    data.diagnosticId = newCounter;
    fs.writeFileSync(counterFilePath, JSON.stringify(data, null, 2)); // Změna zde
    return newCounter;
}

export function incrementCounterOrderId(): number {
    const data = JSON.parse(fs.readFileSync(counterFilePath, 'utf-8'));
    const newCounter = data.idSO + 1;
    data.idSO = newCounter;
    fs.writeFileSync(counterFilePath, JSON.stringify(data, null, 2)); // Změna zde
    return newCounter;
}

export function incrementCounterserviceFeasibilityId(): number {
    const data = JSON.parse(fs.readFileSync(counterFilePath, 'utf-8'));
    const newCounter = data.idSF + 1;
    data.idSF = newCounter;
    fs.writeFileSync(counterFilePath, JSON.stringify(data, null, 2)); // Změna zde
    return newCounter;
}
