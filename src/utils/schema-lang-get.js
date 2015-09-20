var __base = __base || '../';
var c = require(__base + 'constants');
var log = require(__base + 'utils/log')('utils/schema-get-lang');

var SCHEMA_LANG_DIR = __base + 'lang/schemas/';

function getSchemaLang(schema, lang){
    return require(SCHEMA_LANG_DIR + schema + '/' + lang);
}

module.exports = getSchemaLang;