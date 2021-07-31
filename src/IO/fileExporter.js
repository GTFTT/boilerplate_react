
//vendor
import _ from "lodash";

//proj
import { showError } from 'UI'
import { downloadFile } from 'utils';

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