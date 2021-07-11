/**
 * Different types of actions require different processing, for example we have to have at
 * least two duck actions created for "fetch" type - FETCH_SOMETHING and FETCH_SOMETHING_SUCCESS
 */
const ACTION_TYPES = {
    fetch: "fetch",
    set: "set",
}

const DEFAULT_FILE_SAVING_PATH = ''


module.exports = {
    ACTION_TYPES,
};