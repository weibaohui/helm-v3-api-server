const {   _executeHelm, _validateNotEmpty,_convertToBool,_getRepoPath,_gitReady } = require('../utils/util');
const  helmPackage= async (packageOptions)=>{
  const { chartPath } = packageOptions;
  const repoPath = _getRepoPath();
  let packageCommand = 'package ';
  _validateNotEmpty(chartPath, 'chartPath');
  packageCommand += `${chartPath}`;
  await _gitReady();
  if (packageOptions.dependencyUpdate !== undefined
    && _convertToBool(packageOptions.dependencyUpdate)) {
      packageCommand += ' --dependency-update ';
  }
  if (packageOptions.sign !== undefined
    && _convertToBool(packageOptions.sign)) {
      if(packageOptions.key !== undefined&& packageOptions.key != null && packageOptions.key !== ''){
        packageCommand += ' --sign ';
        packageCommand += ` --key ${packageOptions.key}`;
      }
  }
  if(packageOptions.appVersion !== undefined&& packageOptions.appVersion != null && packageOptions.appVersion !== ''){
    packageCommand += ` --app-version ${packageOptions.appVersion}`;
  }

  if(packageOptions.keyring !== undefined&& packageOptions.keyring != null && packageOptions.keyring !== ''){
    packageCommand += ` --keyring ${packageOptions.keyring}`;
  }
  if(packageOptions.destination !== undefined&& packageOptions.destination != null && packageOptions.destination !== ''){
    packageCommand += ` --destination ${packageOptions.destination}`;
  }
  if(packageOptions.version !== undefined&& packageOptions.version != null && packageOptions.version !== ''){
    packageCommand += ` --version ${packageOptions.version}`;
  }


  if(packageOptions.namespace !== undefined&& packageOptions.namespace != null && packageOptions.namespace !== ''){
    packageCommand += ` --namespace ${packageOptions.namespace}`;
  }
  return await _executeHelm(packageCommand,repoPath);
}
module.exports = helmPackage ;