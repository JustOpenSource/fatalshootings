var __base = __base || '../',
    c = require(__base + 'shared-config/constants'),
    log = c.getLog('shared-utils/http-get');

function getSchemaLang(schema, lang){
    return require(__base + 'lang/_schema/' + schema + '/' + lang);
}

module.exports = getSchemaLang;