const {_convertToBool,_checkoutputFormatValue,_validateIntNumber,_validateNotEmpty,_executeHelm} = require('../utils/util');
/**
* helm rollback RELEASE [revision] [flags]
* --cleanup-on-fail
* --dry-run
* --force
* --no-hooks
* --recreate-pods
* --timeout (default 5m5s)
* --wait combined with timeout
*/
const helmRollback=async (rollbackOptions)=>{
    let rollbackCommand = `rollback `;
    _validateNotEmpty(rollbackOptions.releaseName, 'releaseName');
    _validateNotEmpty(rollbackOptions.revision, 'revision');
    rollbackCommand += `${rollbackOptions.releaseName.toLowerCase()} ${rollbackOptions.revision} `;

      if (rollbackOptions.cleanupOnFail !== undefined
        && _convertToBool(rollbackOptions.cleanupOnFail)) {
          rollbackCommand += ' --cleanup-on-fail ';
      }
      if (rollbackOptions.dryRun !== undefined
        && _convertToBool(rollbackOptions.dryRun)) {
          rollbackCommand += ' --dry-run ';
      }
      if (rollbackOptions.force !== undefined
        && _convertToBool(rollbackOptions.force)) {
          rollbackCommand += ' --force ';
      }
      if (rollbackOptions.noHooks !== undefined
        && _convertToBool(rollbackOptions.noHooks)) {
          rollbackCommand += ' --no-hooks ';
      }
      if (rollbackOptions.recreatePods !== undefined
        && _convertToBool(rollbackOptions.recreatePods)) {
          rollbackCommand += ' --recreate-pods ';
      }
      if (rollbackOptions.wait !== undefined
        && _convertToBool(rollbackOptions.wait)) {
          rollbackCommand += ' --wait ';
      }
      if (rollbackOptions.timeout !== undefined) {
          rollbackCommand += ' --timeout '+ rollbackOptions.timeout;
      }
      if(rollbackOptions.namespace !== undefined&& rollbackOptions.namespace != null && rollbackOptions.namespace !== ''){
        rollbackCommand += ` --namespace ${rollbackOptions.namespace}`;
      }
     return await _executeHelm(rollbackCommand);
  }
  module.exports = helmRollback;
