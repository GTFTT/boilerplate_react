//vendor
import _ from "lodash";

/**
 * Save file on user's local machine. Just provide content you wnat to save.
 * @param { String } text - content of a file
 */
export const downloadTxtFile = (text, filename = 'myFile.txt') => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});

    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

/**
 * Generate text from array of lines with new line at the end of each.
 * Last line does not have a new line character.
 * @param { Array } text - array of strings
 */
export const lines = (textArr) => {
    const filteredLines = _.filter(textArr, (line) => Boolean(line) || line === ""); // Remove all false values except of empty string
    
    return filteredLines.join("\n");
}