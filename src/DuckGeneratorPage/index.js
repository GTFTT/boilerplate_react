//vendor
import React from 'react';
import { Collapse, Input } from 'antd';

import InputArray from './InputArray';

const Panel = Collapse.Panel;

export default class DuckGeneratorPage extends React.Component {


    render() {

        return (
            <div>
                <Collapse defaultActiveKey={['1', '2']} onChange={(key) => console.log("Change: ", key)}>
                    <Panel header="Enter module name" key="1">
                        <Input placeholder="Module name"/>
                    </Panel>
                    <Panel header="Create actions" key="2">
                        <InputArray />
                    </Panel>
                </Collapse>
            </div>
        );
    }
}