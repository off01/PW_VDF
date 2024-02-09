/**
 * Generates a random number as a string of the specified length.
 *
 * @param {number} length - Délka generovaného náhodného čísla (počet číslic).
 *                          Musí být kladné celé číslo.
 * @returns {string} Náhodně generované číslo jako řetězec o zadané délce.
 *                   Pokud je zadaná délka 0, vrátí prázdný řetězec.
 */

export function generateRandomNumber(length: number): string {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

/**
 * Generates a unique key with a predefined format.
 *
 * This function builds a key by combining random numbers and predefined text strings.
 * The key has the format "XVFCZ:0/0:Y#optinZ@optin.t-mobile.cz", where X, Y and Z are random numbers
 * generated by the generateRandomNumber function.
 *
 * @returns {string} Vygenerovaný klíč ve specifikovaném formátu.
 */

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

/**
 * Generates random hexadecimal digits.
 *
 * @returns {string} Náhodně vygenerovaná hexadecimální číslice jako řetězec.
 */

export function generateRandomHexDigit(): string {
  const hexDigits = "0123456789ABCDEF";
  const randomIndex = Math.floor(Math.random() * hexDigits.length);
  return hexDigits[randomIndex];
}

/**
 * Generates a random hexadecimal string of 8 characters.
 *
 * This function creates a string of randomly generated hexadecimal digits.
 * Calls the `generateRandomHexDigit` function for each of the 8 characters in the resulting string,
 * which should return one random hexadecimal digit (0-9, a-f).
 *
 * @returns {string} Náhodný hexadecimální řetězec o délce 8 znaků.
 */

export function generateRandomHex(): string {
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += generateRandomHexDigit();
  }
  return result;
}

/**
 * Generates a random MAC address.
 *
 * This function generates a string representing the MAC address in standard 12 hexadecimal digits format.
 * separated by colons. Each pair of hexadecimal digits is generated randomly.
 *
 * @returns {string} Náhodně vygenerovaná MAC adresa ve formátu XX:XX:XX:XX:XX:XX, kde X představuje
 *                   hexadecimální číslici (0-9, A-F).
 */

export function generateMacAddress(): string {
  const hexDigits = "0123456789ABCDEF";
  let macAddress = "";
  for (let i = 0; i < 6; i++) {
    macAddress += hexDigits.charAt(Math.floor(Math.random() * 16));
    macAddress += hexDigits.charAt(Math.floor(Math.random() * 16));
    if (i !== 5) macAddress += ":";
  }
  return macAddress;
}

/**
 * Generates a random number of specified length.
 *
 * @param {number} length - The length of the random number.
 * @returns {string} - A random number as a string.
 */

export function randomTextGenerator(length: number): string {
  const words = [
    "Lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
  ];
  let text = "";
  let currentLength = 0;
  while (currentLength < length) {
    const wordIndex = Math.floor(Math.random() * words.length);
    const word = words[wordIndex];
    if (currentLength + word.length <= length) {
      text += word + " ";
      currentLength += word.length + 1;
    } else {
      break;
    }
  }
  return text.trim();
}

export function choosehwProfile(typeHW: string): string {
  if (typeHW === 'WHSHWCG31' || typeHW === 'WHSHWCG31P') {
      return 'TMCZ DOCSIS';
  } else if (typeHW === 'WHSHWCBYOD') {
      return 'TMCZ CBYOD';
  } else if (typeHW === 'WHSHWONT') {
      // Náhodný výběr mezi 'TMCZ VEIP14' a 'TMCZ VEIP6'
      return Math.random() < 0.5 ? 'TMCZ VEIP14' : 'TMCZ VEIP6';
  } else if (typeHW === 'WHSHWOBYOD') {
      return 'TMCZ OBYOD';
  }
}