
//vendor
import _ from "lodash";

//proj
import { showError } from 'UI'
import { downloadFile } from 'utils';

/**
 * This is used to save generation object in form of .json file.
 * @param { Object } generationObject - object to be converted and saved
 */
const exportGenerationObject = (generationObject) => {
    if(!generationObject || _.isEmpty(generationObject)) {
        showError("Generation object is empty!");
        return;
    }
    const json = JSON.stringify(generationObject, null, 4);

    downloadFile(json, 'GenerationObject', '.json');
}

export {
    exportGenerationObject
}