//vendor
import _ from 'lodash';

//project
import { ACTION_TYPES } from 'globalConstants';
import { lines } from 'utils';


export default ({pageName, pageTableName, moduleDescription, actions, dataSourceAction}) => {

    const generateImports = () => {
        let res = "";

        res+= lines([
            `// vendor`,
            `import React, {Component} from 'react';`,
            `import {FormattedMessage, injectIntl } from 'react-intl';`,
            `import { connect } from 'react-redux';`,
            `import { Tabs, Icon, Col, Row, Input, Select, Button, Table } from 'antd';`,
            `import _ from 'lodash';`,
            `import { fetchAPI } from 'utils';`,
            `import { v4 } from 'uuid';`,
            ``,
            `// proj`,
            `import { Layout, StyledButton } from 'commons';`,
            `import { setModal, MODALS } from 'core/modals/duck';`,
            ``,
            `//own`,
            `import { columnsConfig } from './config';`,
            `import Styles from './styles.m.css';`,
            `import {`,

            //Print each action separately
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.set),
                ({actionCreators}) => `${actionCreators.set},`
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.fetch),
                ({actionCreators}) => lines([
                    `${actionCreators.fetch},`,
                    `${actionCreators.setValueFilters},`,
                ])
            ),
            lines([
                `${_.get(dataSourceAction, 'selectors.value')},`,
                `${_.get(dataSourceAction, 'selectors.statsValue')},`,
                `${_.get(dataSourceAction, 'selectors.filtersValue')},`,
                `${_.get(dataSourceAction, 'selectors.fetchingValue')},`,
            ]),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.poorSagaAction),
                ({actionCreators}) => `${actionCreators.poorSagaAction},`
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.poorReducerAction),
                ({actionCreators}) => `${actionCreators.poorReducerAction},`
            ),
            `} from 'pages/${pageName}/redux/duck';`,
            `\n`
        ]);

        return res;
    }

    const generateMapStateToProps = () => {
        let res = lines([
            `const mapStateToProps = state => ({`,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.fetch),
                ({valueNames, selectors}) => lines([
                    `${valueNames.value}: ${selectors.value}(state),`,
                    `${valueNames.statsValue}: ${selectors.statsValue}(state),`,
                    `${valueNames.filtersValue}: ${selectors.filtersValue}(state),`,
                    `${valueNames.fetchingValue}: ${selectors.fetchingValue}(state),`,
                    ``,
                ])
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.set),
                ({valueNames, selectors}) => `${valueNames.value}: ${selectors.value}(state),`
            ), 
            `});`,
        ]);

        return res;
    }

    const generateMapDispatchToProps = () => {
        let res = lines([
            `const mapDispatchToProps = ({`,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.fetch),
                ({ actionCreators}) => lines([
                    `${actionCreators.fetch},`,
                    `${actionCreators.setValueFilters},`,
                ])
            ),
            ``,
            ..._.map(
                _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.set),
                ({ actionCreators}) => `${actionCreators.set},`
            ), 
            `});`,
        ]);

        return res;
    }

    const generateClass = () => {
        let res = lines([
            `/**`,
            ...(
                moduleDescription
                    ? _.map(moduleDescription.split('\n'), (str) => ` * ${str}`)
                    : []
            ),
            ` */`,
            `@injectIntl`,
            `@connect(mapStateToProps, mapDispatchToProps)`,
            `export default class ${pageTableName} extends Component {`,
            `constructor(props) {`,
            `super(props);`,
            `}`,
            ``,
            `render() {`,
                `const {`,
                ..._.map(
                    _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.fetch),
                    ({ valueNames }) => lines([
                        `${valueNames.value},`,
                        `${valueNames.fetchingValue},`,
                    ])
                ),
                ``,
                `${_.get(dataSourceAction, 'valueNames.statsValue')},`,
                `${_.get(dataSourceAction, 'valueNames.filtersValue')},`,
                `${_.get(dataSourceAction, 'actionCreators.setValueFilters')},`,
                ``,
                ..._.map(
                    _.filter(actions, ({actionType}) => actionType == ACTION_TYPES.set),
                    ({ valueNames }) => `${valueNames.value},`
                ),
                `} = this.props;`,
                ``,
                `const pagination = {`,
                    `pageSize: 25,`,
                    `size: "large",`,
                    `total: Math.ceil(${_.get(dataSourceAction, 'valueNames.statsValue')}.totalCount / 25) * 25,`,
                    `current: ${_.get(dataSourceAction, 'valueNames.filtersValue')}.page,`,
                    `onChange: page => {`,
                        `${_.get(dataSourceAction, 'actionCreators.setValueFilters')}({page})`,
                    `},`,
                `}`,
                ``,
                `return (`,
                        `<div className={Styles.tableContainer}>`,
                            `<Table`,
                                `className={Styles.table}`,
                                `dataSource={ ${_.get(dataSourceAction, 'valueNames.value')} }`,
                                `columns={columnsConfig()}`,
                                `pagination={pagination}`,
                                `loading={ ${_.get(dataSourceAction, 'valueNames.fetchingValue')} }`,
                                `rowKey={() => v4()}`,
                                `bordered`,
                            `/>`,
                        `</div>`,
                    `)`,
                `}`,
            `}`,
        ]);

        return res;
    }

    return {
        generateImports,
        generateMapStateToProps,
        generateMapDispatchToProps,
        generateClass,
    };
}