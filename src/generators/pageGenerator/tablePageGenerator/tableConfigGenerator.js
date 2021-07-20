//vendor
import _ from 'lodash';

//project


/**
 * This file created for generating config of a table component.
 */
export default () => {

    const generateTableConfigFile = () => {
        return (`    
// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
import { DatePicker, InputNumber } from 'antd';

//Proj
import { Numeral } from "commons";

//Own

//Choose width for each col, (100% in total or less than 100% if 'auto' is present)
const defWidth = {
}

const DATETIME_FORMAT = 'DD.MM.YYYY';
    
export function columnsConfig() {    
    const storeGroupCol = {
        title:     <FormattedMessage id='vehicle_page.store_group' />,
        width:     defWidth.storeGroupCol,
        dataIndex: 'storeGroupName',
        key:       'storeGroupName',
    };

    return [
        storeGroupCol,
    ];
}
    
        `);
    }

    return {
        generateTableConfigFile
    };
}