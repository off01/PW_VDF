export function generateRandomNumber(length: number): string {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

export function generateKey(): string {
    // Generování částí řetězce
    const prefix = "VFCZ:0/0:";
    const optin = "#optin";
    const domain = "@optin.t-mobile.cz";

    // Generování náhodných čísel
    const randomNumber1 = generateRandomNumber(9);
    const randomNumber2 = generateRandomNumber(12);
    const randomNumber3 = generateRandomNumber(8);

    // Sestavení konečného řetězce
    return `${randomNumber1}${prefix}${randomNumber2}${optin}${randomNumber3}${domain}`;
}

export function generateRandomHexDigit(): string {
    const hexDigits = '0123456789ABCDEF';
    const randomIndex = Math.floor(Math.random() * hexDigits.length);
    return hexDigits[randomIndex];
}

export function generateRandomHex(): string {
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += generateRandomHexDigit();
    }
    return result;
}