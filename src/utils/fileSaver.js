/*
    This module is created for handle file saving operations.
*/

//vendor
import _ from "lodash";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

//proj
import { TYPES_OF_FILES } from 'globalConstants';

//own

const MAX_ZIP_DEEP = 10;

/**
 * Save file on user's local machine. Just provide content you wnat to save.
 * @param { String } text - content of a file
 * 
 * @example 
 * downloadTxtFile("Hello world", "hello.txt")
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
 * ***Recursive*** function for building zip file structure by creating nested files/folders or just creating a file on current iteration.
 * @param {*} fileBuildingObject This is one of file or folder objects used for generating;
 * @param {*} zipFile - instance of JSZip file on current iteration.
 * @param {*} prevDeep - previous deep value, used to indicate too deep folders nesting(possibly recursive dead loop)
 */
const fileBuilder = (fileBuildingObject, zipFile, prevDeep) => {
    const { type, name, extension, content, fileProps } = fileBuildingObject;
    const currDeep = prevDeep + 1;
    
    if(currDeep >= MAX_ZIP_DEEP) throw "Error, max folder deep when generating zip file reached. Make sure you do not have recursive dead loop here!"
    if(!name) throw "No name provided for one of the files";
    if(!type) throw "No type provided for one of the files";

    switch (type) {
        case TYPES_OF_FILES.file:
            zipFile.file(`${name}${extension? extension: ""}`, content, fileProps);
            break;

        case TYPES_OF_FILES.directory:
            const newZipFileInstance = zipFile.folder(name);
            _.each(content, (obj) => fileBuilder(obj, newZipFileInstance, currDeep));
            break;
    }
}

/**
 * Used to generate zip file and save it on user's local pc vi saveAs. This used recursive method of building directories structure
 * so it can be used for different purposes and file structures. For object reference see examples.
 * @param {*} filesTree 
 * @param {*} filename 
 * @param {*} fileExtension
 * 
 * @example
 * // example of filesTree:
 * const plug = [
 *      {
 *          type: TYPES_OF_FILES.file,
 *          name: 'helloTxt',
 *          content: "Hello world",
 *          extension: '.txt',
 *          fileProps: undefined
 *      },
 *      {
 *          type: TYPES_OF_FILES.directory,
 *          name: 'myDir',
 *          content: [
 *              {
 *                  type: TYPES_OF_FILES.file,
 *                  name: 'helloTxt2',
 *                  extension: '.txt',
 *                  content: "Hello 2",
 *                  fileProps: undefined
 *              },
 *              {
 *                  type: TYPES_OF_FILES.file,
 *                  name: 'smile',
 *                  extension: '.png',
 *                  content: "iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAvUlEQVRIS+2VQQ6AIAwE7f8fjcGIQSJ0FpRw0CuG6W7p1kIIYZv42dJAMzu8GDFFUhiBEZbAPXAMTLCy3apqBKzBEtw7z4t0gfQyavNaQKouWkZ72VRIgRR2FOYNvgelvbseWC+wBHmFYWDen6fITUFA08e19DZDZ9I8Df8nwNpSoXaiR0M211SgAntF4VSgChtSqKRLc1uQqnthVYV5ipRbfQSGLW0VQMZGWsDqhd7/UrR5l5HzH0hckv7ZAQ7W2K0nyHmFAAAAAElFTkSuQmCC",
 *                  fileProps: {base64: true},
 *              },
 *          ]
 *      }
 *  ];
 */
export const downloadZipFile = (filesTree, filename = 'myFile', fileExtension = '.zip') => {
    
    const initZipDeep = 0; //How many folders deep created
    var zip = new JSZip();

    // Build zip file
    _.each(filesTree, obj => fileBuilder(obj, zip, initZipDeep));

    // Save file
    zip.generateAsync({type:"blob"})
        .then(function(content) {
            saveAs(content, `${filename}${fileExtension}`);
        })
        .catch(console.log);
}