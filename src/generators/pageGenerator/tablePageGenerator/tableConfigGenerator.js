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
            `import _ from 'lodash';`, 
            `import moment from 'moment';`, 
            `import { DatePicker, InputNumber } from 'antd';`, 
            ``, 
            `//Proj`,
            `import { Numeral } from 'commons';`, 
            ``, 
            `//Own`, 
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
                `        title:     (${formattedMessage}),`, 
                `        width:     defWidth.${tableConfigName},`,
                `        align:     '${tableConfigAlign}',`,
                `        dataIndex: '${tableConfigDataIndex}',`, 
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