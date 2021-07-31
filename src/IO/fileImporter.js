
//vendor
import _ from "lodash";

//proj
import { showError, showInfo, showSuccess } from 'UI'
import { downloadFile } from 'utils';

const importGenerationObject = (fileImportedCB) => {
    const element = document.createElement("input");
    element.type = "file";
    element.accept=".json";

    //Event: when file is selected
    element.onchange = (e) => {
        const filePath = _.get(e, 'target.files[0]');
        if(!filePath) {
            showInfo("File was not selected");
            return;
        }

        const reader = new FileReader();

        reader.onload = async (e) => { 
            const json = (e.target.result)
            try{
                const parsedJson = JSON.parse(json);
                fileImportedCB && fileImportedCB(parsedJson);
                showSuccess("File loaded");
            } catch(err) {
                showError("File is corrupted and cannot be parsed");
                console.error(err);
            }
        };
        reader.readAsText(filePath);
    };

    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
}

export {
    importGenerationObject
}