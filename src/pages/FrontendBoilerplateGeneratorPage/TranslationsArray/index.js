//vendor
import React from 'react';
import { Input, List, Button, Select } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import _ from 'lodash';
import { v4 } from 'uuid';
import { camelCase, constantCase, sentenceCase } from 'change-case';
import { connect } from "react-redux";

//proj
import { ACTION_TYPES, DEF_INIT_VALUES } from 'globalConstants';
import {
    setTranslations,
    selectTranslations,
} from 'pages/FrontendBoilerplateGeneratorPage/redux/duck';

//own
import './styles.css';

const Item = List.Item;


const mapStateToProps = state => ({
    translations: selectTranslations(state),
});

const mapDispatchToProps = {
    setTranslations,
};


/**
 * Generate array of translations. Used to generate translation files
 * 
 */
class ActionsArray extends React.Component {
    /**
     * Used to update translations.
     * @param {*} params.translations - new translations to replace old with 
     */
    updateTranslations = ({ translations }) => {
        const { setTranslations } = this.props;

        setTranslations( translations );
    }

    /**
     * Generate new translation with initial values setup
     */
    createTranslation = () => {
        const { translations } = this.props;

        this.updateTranslations({
            translations: [
                ...translations,
                {
                    translationName: "test",
                    translationEn: undefined,
                    translationUk: undefined,
                    translationRu: undefined,
                    key: v4(),
                }
            ]
        })
    }

    deleteTranslation = (key) => {
        const { translations } = this.props;

        this.updateTranslations({
            translations: [
                ..._.filter(translations, (item) => item.key != key),
            ]
        })
    }
    /**
     * Change value of a translation object.
     * Values will be replaced only if they were provided.
     * @param {*} key - uuid
     * @param {*} params - translation
     */
    changeTranslation = (key, options) => {
        const { translations } = this.props;

        const updatedTranslations = _.map(translations, (item) => {
            if(item.key == key)
                return {
                    ...item,
                    translationName: ("translationName" in options)
                        ? options.translationName
                        : item.translationName,

                    translationEn: ("translationEn" in options)
                        ? options.translationEn
                        : item.translationEn,

                    translationUk: ("translationUk" in options)
                        ? options.translationUk
                        : item.translationUk,

                    translationRu: ("translationRu" in options)
                        ? options.translationRu
                        : item.translationRu,
                }
            else
                return item;
        })

        this.updateTranslations({
            translations: updatedTranslations
        })
    } 


    render() {
        const { translations } = this.props;

        return (
            <div>
                <List
                    size={"small"}
                    bordered
                    dataSource={translations}
                    locale={{emptyText: (<div>No translations</div>)}}
                    header={
                        <Button onClick={() => this.createTranslation()} type="primary">Create a new one</Button>
                    }
                    renderItem={item => (
                        <Item
                            translations={[
                                <Button onClick={() => this.deleteTranslation(item.key)}><DeleteTwoTone /></Button>
                            ]}
                            key={item.key}
                        >
                            <div className={"item"}>
                                <Input
                                    value={_.get(item, 'translationName')}
                                    placeholder="Name"
                                    className="input"
                                    onChange={(e) => this.changeTranslation(item.key, {translationName: e.target.value})}
                                />
                                <Input
                                    value={_.get(item, 'translationEn')}
                                    placeholder="English"
                                    className="input"
                                    onChange={(e) => this.changeTranslation(item.key, {translationEn: e.target.value})}
                                />
                                <Input
                                    value={_.get(item, 'translationUk')}
                                    placeholder="Українська"
                                    className="input"
                                    onChange={(e) => this.changeTranslation(item.key, {translationUk: e.target.value})}
                                />
                                <Input
                                    value={_.get(item, 'translationRu')}
                                    placeholder="Русский"
                                    className="input"
                                    onChange={(e) => this.changeTranslation(item.key, {translationRu: e.target.value})}
                                />
                            </div>
                        </Item>
                    )}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsArray);