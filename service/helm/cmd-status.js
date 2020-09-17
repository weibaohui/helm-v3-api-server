const { _checkoutputFormatValue, _validateIntNumber, _executeHelm, _validateNotEmpty } = require('../utils/util');
/**
* helm status RELEASE [flags]
* --revision
* --output format
*/
const helmStatus = async (statusOptions) => {
  const { releaseName } = statusOptions;
  let statusCommand = 'status ';
  _validateNotEmpty(releaseName, 'releaseName');
  statusCommand += `${releaseName.toLowerCase()}`;
  if (statusOptions.outputFormat !== undefined) {
    let format = _checkoutputFormatValue(statusOptions.outputFormat);
    if (format) {
      statusCommand += ' -o ' + format + ' ';
    } else {
    }
  } else {
    statusCommand += ' -o json ';
  }
  if (statusOptions.revision !== undefined) {
    let num = _validateIntNumber(statusOptions.revision);
    num ? statusCommand += ' --max ' + num + ' ' : "";
  }
  if(statusOptions.namespace !== undefined&& statusOptions.namespace != null && statusOptions.namespace !== ''){
    statusCommand += ` --namespace ${statusOptions.namespace}`;
  }
  return await _executeHelm(statusCommand);
}
module.exports = helmStatus;