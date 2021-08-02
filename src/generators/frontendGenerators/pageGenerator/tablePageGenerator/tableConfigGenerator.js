//vendor
import _ from 'lodash';

//project
import { lines } from 'utils';


/**
 * This file created for generating config of a table component.
 */
export default (generationObject) => {
    const { tableConfigs } = generationObject;

    const generateTableConfigFile = () => {

        return lines([
            `// vendor`, 
            `import React from 'react';`, 
            `import { FormattedMessage } from 'react-intl';`, 
            `import { DatePicker, InputNumber, Col, Row, Popover } from 'antd';`, 
            `import { Link } from "react-router-dom";`,
            `import moment from 'moment';`, 
            `import _ from 'lodash';`, 
            ``, 
            `//Proj`,
            `import { Numeral } from 'commons';`,
            `import book from 'routes/book'`,
            ``, 
            `//Own`, 
            `import Styles from "./styles.m.css";`, 
            ``,
            `//Choose width for each col, (100% in total or less than 100% if 'auto' is present)`, 
            `const defWidth = {`,
            _.map(tableConfigs, ({tableConfigName, tableConfigWidth}) => `${tableConfigName}: '${tableConfigWidth}'`).join(",\n"),
            `}`, 
            ``,
            `export function columnsConfig() {`, 
            _.map(tableConfigs, ({ tableConfigName, tableConfigDataIndex, tableConfigAlign, formattedMessage }) => {
                return lines([
                `    const ${tableConfigName} = {`, 
                formattedMessage
                    ? `        title:     (${formattedMessage}),`
                    : undefined, 
                `        width:     defWidth.${tableConfigName},`,
                `        align:     '${tableConfigAlign}',`,
                tableConfigDataIndex
                    ? `        dataIndex: '${tableConfigDataIndex}',`
                    : undefined,
                `        key:       '${tableConfigName}',`,
                `    };`
                ]);
            }).join("\n"),
            ``,
            `    return [`, 
            _.map(tableConfigs, ({tableConfigName}) => {
                return lines([
                    `        ${tableConfigName}`, 
                ]);
            }).join(",\n"),
            `    ];`, 
            `}`, 
            ``
        ]);
    };

    return {
        generateTableConfigFile
    };
}