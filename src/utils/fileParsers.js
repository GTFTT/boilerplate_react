/**
 * This module is created for parsing different types of files as fast and easy as possible.
 * Just call function for specific filetype you need and provided text will be parsed to pretty format!
 * 
 * Formatter can even validate code you generate!
 * 
 * For more information see:
 * @see https://prettier.io/docs/en/api.html - general description of prettier abilities
 * @see https://github.com/prettier/prettier/issues/6264 - each prettier parser has to be imported separately
 * @see https://github.com/GTFTT/boilerplate_react/issues/5 - git hub feature issue
 */

import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';

/**
 * Parses .js and .jsx files so it appears much better.
 * @param {*} text text to pe parsed
 * @returns Parsed text
 */
const parseJsx = (text) => {
    try{
        return prettier.format(text, {semi: true, tabWidth: 4, parser: 'babel', plugins: [parserBabel]});
    } catch(error) {
        console.error(error);
    }
    return text; //If error occurs while parsing we have to return at least text
}

export {
    parseJsx
};