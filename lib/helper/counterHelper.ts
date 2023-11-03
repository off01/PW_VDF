import fs from "fs";
import path from "path";
import config from '../../config/config';

const counterFilePath = path.join(__dirname, `../../config/${config.currentEnv}/counter.json`);

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

export function incrementCounterservicePartyId(): number {
    const data = JSON.parse(fs.readFileSync(counterFilePath, 'utf-8'));
    const newCounter = data.idPF + 1;
    data.idPF = newCounter;
    fs.writeFileSync(counterFilePath, JSON.stringify(data, null, 2)); // Změna zde
    return newCounter;
}

export function incrementCounterserviceCustomerAppointmentId(): number {
    const data = JSON.parse(fs.readFileSync(counterFilePath, 'utf-8'));
    const newCounter = data.idCA + 1;
    data.idCA = newCounter;
    fs.writeFileSync(counterFilePath, JSON.stringify(data, null, 2)); // Změna zde
    return newCounter;
}