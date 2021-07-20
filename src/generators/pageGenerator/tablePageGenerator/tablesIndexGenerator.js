//vendor
import _ from 'lodash';

/**
 * index.js file for exporting table from tables directory
 */
export default ({pageTableName}) => {

    const generateTableIndexFile = () => {
        return (`export { default as ${pageTableName} } from './${pageTableName}';`);
    }

    return {
        generateTableIndexFile
    };
}