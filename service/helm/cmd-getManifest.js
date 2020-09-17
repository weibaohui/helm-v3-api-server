const {  _validateIntNumber, _executeHelm, _validateNotEmpty } = require('../utils/util');
const helmGetManifest = async (getManifestOptions)=>{
  const { releaseName } = getManifestOptions;
  let getManifestCommand = 'get manifest ';
  _validateNotEmpty(releaseName, 'releaseName');
  getManifestCommand += `${releaseName.toLowerCase()} `;

  if (getManifestOptions.revision !== undefined) {
    let num = _validateIntNumber(getManifestOptions.revision);
    num ? getManifestCommand += ' --revision ' + num + ' ' : "";
  }
  if(getManifestOptions.namespace !== undefined&& getManifestOptions.namespace != null && getManifestOptions.namespace !== ''){
    getManifestCommand += ` --namespace ${getManifestOptions.namespace}`;
  }
  return await _executeHelm(getManifestCommand);
}
module.exports = helmGetManifest ;