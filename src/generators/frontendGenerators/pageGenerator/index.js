//proj
import { lines, parseJsx } from "utils";

//own
import poorPageGenerator from "./poorPageGenerator/poorPageGenerator";

import tablePageGenerator from "./tablePageGenerator/tablePageGenerator";
import tableGenerator from "./tablePageGenerator/tableGenerator";
import tableConfigGenerator from "./tablePageGenerator/tableConfigGenerator";
import tableStylesGenerator from "./tablePageGenerator/tableStylesGenerator";
import tablesIndexGenerator from "./tablePageGenerator/tablesIndexGenerator";

export default (generationObject) => {
    
    /** Poor page, contains nothing except basic layout. */
    const generatePoorPage = () => {
        const {
            generateImports,
            generateMapStateToProps,
            generateMapDispatchToProps,
            generateClass,
        } = poorPageGenerator(generationObject);

        const res = lines([
            generateImports(),
            generateMapStateToProps(),
            ``,
            generateMapDispatchToProps(),
            ``,
            generateClass(),
        ]);

        return parseJsx(res);
    };

    /** This is the page where table is invoked for rendering, there can be placed filters, modals, main description of the module etc. */
    const generateTablePage = () => {
        const {
            generateImports,
            generateMapStateToProps,
            generateMapDispatchToProps,
            generateClass,
        } = tablePageGenerator(generationObject);

        const res = lines([
            generateImports(),
            generateMapStateToProps(),
            ``,
            generateMapDispatchToProps(),
            ``,
            generateClass(),
        ]);

        return parseJsx(res);
    }

    /** This file contains table file, there configs and styles are connected */
    const generateTable = () => {
        const {
            generateImports,
            generateMapStateToProps,
            generateMapDispatchToProps,
            generateClass,
        } = tableGenerator(generationObject);

        const res = lines([
            generateImports(),
            generateMapStateToProps(),
            ``,
            generateMapDispatchToProps(),
            ``,
            generateClass(),
        ]);

        return parseJsx(res);
    }

    /** File that contains table's columns configuration */
    const generateTableConfig = () => {
        const { generateTableConfigFile } = tableConfigGenerator(generationObject);
        return parseJsx(generateTableConfigFile());
    }

    /** Basic table styles and styles for fixing known issues */
    const generateTableStyles = () => {
        const { generateTableStyleFile } = tableStylesGenerator(generationObject);
        return generateTableStyleFile();
    }

    /** index.js file for exporting table from tables directory */
    const generateTablesIndexFile = () => {
        const { generateTableIndexFile } = tablesIndexGenerator(generationObject);
        return parseJsx(generateTableIndexFile());
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