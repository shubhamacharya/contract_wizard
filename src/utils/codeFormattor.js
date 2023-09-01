const beautify = require('js-beautify').js_beautify;
const jsonData = require('../utils/codeSections.json');

const formatCode = (code) => {
    return beautify(code, { indent_size: 2 });
}

const indentCode = (codeString,indent) => {
    return codeString.padStart((codeString.length+indent)," ");
}

const buildFeaturesList = (activeTab) => {
    let obj = {};
    jsonData[activeTab]["features"].forEach((feat) => {
      obj[feat] = false;
    });
    return obj;
  }
module.exports = {formatCode,indentCode,buildFeaturesList}
