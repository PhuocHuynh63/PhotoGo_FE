import { v4 as uuidv4 } from 'uuid';

/**
 * @function generateUUIDV4
 * @returns {string} A randomly generated UUID v4 string.
 * @description Generates a UUID v4 string using the uuid library.
 * This function can be used to create unique identifiers for various purposes, such as database keys, session IDs, or any other scenario where a unique identifier is required.
 */
export const generateUUIDV4 = (): string => {
    return uuidv4();
};