const {_validateNotEmpty,_executeHelm,_convertToBool} = require('../utils/util');
/**
 * Deletes an already installed chart, identified by its release name
 * helm uninstall RELEASE_NAME [...] [flags]
 * --dry-run simulate a uninstall
 * --description string add a custom description
 * --keep-history remove all associated resources and mark the release as deleted, but retain the release history
 * --no-hooks prevent hooks from running during uninstallation
 * --timeout duration time to wait for any individual kubernetes operation(like Jobs for hooks) (default 5m0s)
 */
const  helmDelete = async (delOptions)=> {
    const { releaseName } = delOptions;
    let uninstallCommand = 'uninstall ';
    _validateNotEmpty(releaseName, 'releaseName');
    uninstallCommand += `${releaseName.toLowerCase()} `;

    if (delOptions.dryRun !== undefined
      && _convertToBool(delOptions.dryRun)) {
        uninstallCommand += ' --dry-run ';
    }
    if (delOptions.keepHistory !== undefined
      && _convertToBool(delOptions.keepHistory)) {
        uninstallCommand += ' --keep-history ';
    }
    if (delOptions.noHooks !== undefined
      && _convertToBool(delOptions.noHooks)) {
        uninstallCommand += ' --no-hooks ';
    }
    if (delOptions.timeout !== undefined) {
      uninstallCommand += ' --timeout '+ delOptions.timeout;
    }
    if (delOptions.description !== undefined) {
      uninstallCommand += ' --description '+ delOptions.description;
    }
    if(delOptions.namespace !== undefined&& delOptions.namespace != null && delOptions.namespace !== ''){
      uninstallCommand += ` --namespace ${delOptions.namespace}`;
    }
    return _executeHelm(uninstallCommand);
  }
  module.exports = helmDelete;
