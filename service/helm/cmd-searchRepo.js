const {  _validateIntNumber, _executeHelm, _validateNotEmpty,_checkoutputFormatValue,_convertToBool } = require('../utils/util');
/**
 * helm repo search KEYWORD [flags]
 * devel string
 * outputFormat
 * regexp
 * version string
 * versions
 */
const helmSearchRepo =async (searchRepoOptions)=>{
  let searchRepoCommand = 'search repo ';
  _validateNotEmpty(searchRepoOptions.keyword,"keyword");
  searchRepoCommand += searchRepoOptions.keyword;

  if (searchRepoOptions.revision !== undefined) {
    let num = _validateIntNumber(searchRepoOptions.revision);
    num ? getManifestCommand += ' --revision ' + num + ' ' : "";
  }
  //version and devel
  if(searchRepoOptions.version !== undefined){
    searchRepoCommand += searchRepoOptions.version;
  }else{
    if(searchRepoOptions.devel !== undefined){
        searchRepoCommand += searchRepoOptions.devel;
    }else{

    }
  }
  if (searchRepoOptions.versions !== undefined
    && _convertToBool(searchRepoOptions.versions)) {
        searchRepoCommand += ' --versions ';
  }
  if (searchRepoOptions.regexp !== undefined) {
    searchRepoCommand += '--regexp '+ searchRepoOptions.regexp;
  }
  if (searchRepoOptions.outputFormat !== undefined ) {
    let format = _checkoutputFormatValue(searchRepoOptions.outputFormat);
    if(format){
        searchRepoCommand += ' -o '+format+' ';
    }else{
    }
}else{
    searchRepoCommand += ' -o json ';
}
if(searchRepoOptions.namespace !== undefined&& searchRepoOptions.namespace != null && searchRepoOptions.namespace !== ''){
  searchRepoCommand += ` --namespace ${searchRepoOptions.namespace}`;
}
  return await _executeHelm(searchRepoCommand);
}
module.exports = helmSearchRepo;