
//own
import { lines } from "utils";
import poorPageGenerator from "./poorPageGenerator/poorPageGenerator";

import tablePageGenerator from "./tablePageGenerator/tablePageGenerator";
import tableGenerator from "./tablePageGenerator/tableGenerator";
import tableConfigGenerator from "./tablePageGenerator/tableConfigGenerator";
import tableStylesGenerator from "./tablePageGenerator/tableStylesGenerator";
import tablesIndexGenerator from "./tablePageGenerator/tablesIndexGenerator";

export default (generationObject) => {
    const { moduleDescription, actions} = generationObject;

    /** Poor page, contains nothing except basic layout. */
    const generatePoorPage = () => {
        const {
            generateImports,
            generateMapStateToProps,
            generateMapDispatchToProps,
            generateClass,
        } = poorPageGenerator({moduleDescription, actions});

        return lines([
            generateImports(),
            generateMapStateToProps(),
            ``,
            generateMapDispatchToProps(),
            ``,
            generateClass(),
        ]);
    };

    /** This is the page where table is invoked for rendering, there can be placed filters, modals, main description of the module etc. */
    const generateTablePage = () => {
        const {
            generateImports,
            generateMapStateToProps,
            generateMapDispatchToProps,
            generateClass,
        } = tablePageGenerator(generationObject);

        return lines([
            generateImports(),
            generateMapStateToProps(),
            ``,
            generateMapDispatchToProps(),
            ``,
            generateClass(),
        ]);
    }

    /** This file contains table file, there configs and styles are connected */
    const generateTable = () => {
        const {
            generateImports,
            generateMapStateToProps,
            generateMapDispatchToProps,
            generateClass,
        } = tableGenerator(generationObject);

        return lines([
            generateImports(),
            generateMapStateToProps(),
            ``,
            generateMapDispatchToProps(),
            ``,
            generateClass(),
        ]);
    }

    /** File that contains table's columns configuration */
    const generateTableConfig = () => {
        const { generateTableConfigFile } = tableConfigGenerator(generationObject);
        return generateTableConfigFile();
    }

    /** Basic table styles and styles for fixing known issues */
    const generateTableStyles = () => {
        const { generateTableStyleFile } = tableStylesGenerator(generationObject);
        return generateTableStyleFile();
    }

    /** index.js file for exporting table from tables directory */
    const generateTablesIndexFile = () => {
        const { generateTableIndexFile } = tablesIndexGenerator(generationObject);
        return generateTableIndexFile();
    }

    return {
        generatePoorPage,

        generateTablePage,
        generateTable,
        generateTableConfig,
        generateTableStyles,
        generateTablesIndexFile,
    };
}