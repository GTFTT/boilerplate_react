//vendor
import _ from 'lodash';

//project
import { ACTION_TYPES } from 'globalConstants';
import { lines } from 'utils';



/**
 * This module generates messages.json file, it contains all the translations of a component.
 * Those translations can be used later in other places.
 */
export default (generationObject) => {
    const { translations } = generationObject;

    const generateMessagesFile = () => {
        return lines([
            `{`,
            `\t"en": {`,
            _.map(translations, ({ constantEn }) => `\t\t${constantEn}`).join(',\n'),
            `\t},`,

            `\t"ru": {`,
            _.map(translations, ({ constantRu }) => `\t\t${constantRu}`).join(',\n'),
            `\t},`,

            `\t"uk": {`,
            _.map(translations, ({ constantUk }) => `\t\t${constantUk}`).join(',\n'),
            `\t}`,
            `}`,
        ]);
    }

    return {
        generateMessagesFile
    };
}