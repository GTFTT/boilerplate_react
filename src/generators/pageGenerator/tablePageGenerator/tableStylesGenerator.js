//vendor
import _ from 'lodash';

//project
import { ACTION_TYPES } from 'globalConstants';
import { lines } from 'utils';



/**
 * This module created for generating styles of a table component. But there is no need for generating it, we can just take one and return it as a string.
 */
export default () => {

    const generateTableStyleFile = () => {
        return (`    
.table {
    min-width: 0 !important;
    width: 100%;
}

.table :global(.ant-table-header) {
    text-transform: uppercase;
    min-width: 0 !important; /*IMPORTANT it solves antd table issue when scrolling is added*/
    padding: 0;
}

.table :global(.ant-pagination) {
    float: none;
    justify-content: center;
    display: flex;
}

.table :global(th) {
    padding: 6px 4px 6px 4px !important; /*Remove bug: when text overflows, header shifts left*/
}

.tableContainer {
    background-color: transparent;
    margin: 0.1em 0.2em 2em 0.2em;
}

        `);
    }

    return {
        generateTableStyleFile
    };
}