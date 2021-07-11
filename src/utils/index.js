


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