//vendor
import _ from "lodash";

/**
 * Generate text from array of lines with new line at the end of each.
 * Last line does not have a new line character.
 * All falsy lines will be removed (but empty string remains)
 * @param { Array } text - array of strings
 */
export const lines = (textArr) => {
    const filteredLines = _.filter(textArr, (line) => Boolean(line) || line === ""); // Remove all false values except of empty string
    
    return filteredLines.join("\n");
}

export * from './fileSaver';