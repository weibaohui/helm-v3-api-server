const { _checkoutputFormatValue, _validateIntNumber, _executeHelm, _validateNotEmpty } = require('../utils/util');
const  helmHistory= async (historyOptions)=>{
  const { releaseName } = historyOptions;
  let historyCommand = 'history ';
  _validateNotEmpty(releaseName, 'releaseName');
  historyCommand += `${releaseName.toLowerCase()}`;
  if (historyOptions.outputFormat !== undefined) {
    let format = _checkoutputFormatValue(historyOptions.outputFormat);
    if (format) {
      historyCommand += ' -o ' + format + ' ';
    } else {
    }
  }else{
    historyCommand += ' -o json ';
  }
  if (historyOptions.max !== undefined) {
    let num = _validateIntNumber(historyOptions.max);
    num ? historyCommand += ' --max ' + num + ' ' : "";
  }
  if(historyOptions.namespace !== undefined&& historyOptions.namespace != null && historyOptions.namespace !== ''){
    historyCommand += ` --namespace ${historyOptions.namespace}`;
  }
  return await _executeHelm(historyCommand);
}
module.exports = helmHistory ;