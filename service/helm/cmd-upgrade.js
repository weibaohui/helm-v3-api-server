const {_convertToBool,_checkoutputFormatValue,_validateNotEmpty,
  _installOrUpgradeChart,_validateIntNumber,_getConfigValues,_getCommaArrayValues,
  _getArrayValues,_gitReady} = require('../utils/util');
/**
 * Upgrades an already installed chart, identified by its release name
 * helm upgrade [RELEASE] [CHART] [flags]
 * --atomic                   if set, installation process purges chart on fail. The --wait flag will be set automatically if --atomic is used
 * --devel                    use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored
 * --dry-run                  simulate an install
 * --no-hooks                 prevent hooks from running during install
 * --render-subchart-notes    if set, render subchart notes along with the parent
 * --install                  if a release by this name doesn't already exist, run an install 
 * --verify                   verify the package before installing it
 * --wait                     if set, will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful. It will wait for as long as --timeout
 * --cleanup-on-fail          allow deletion of new resources created in this upgrade when upgrade fails
 * --force                    force resource updates through a replacement strategy
 * --reset-values             when upgrading, reset the values to the ones built into the chart
 * --reuse-values             when upgrading, reuse the last release's values and merge in any overrides from the command line via --set and -f. If '--reset-values' is specified, this is ignored
 * --ca-file string           verify certificates of HTTPS-enabled servers using this CA bundle
 * --cert-file string         identify HTTPS client using this SSL certificate file
 * --key-file string          identify HTTPS client using this SSL key file
 * --keyring string           location of public keys used for verification (default "~/.gnupg/pubring.gpg")
 * --password string          chart repository password where to locate the requested chart
 * --repo string              chart repository url where to locate the requested chart
 * --set stringArray          set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
 * --set-file stringArray     set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)
 * --set-string stringArray   set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
 * --username string          chart repository username where to locate the requested chart
 * --values strings           specify values in a YAML file or a URL(can specify multiple)
 * --version string           specify the exact chart version to install. If this is not specified, the latest version is installed
 * --timeout duration         time to wait for any individual Kubernetes operation (like Jobs for hooks) (default 5m0s)
 * --output format            prints the output in the specified format. Allowed values: table, json, yaml (default table)
 * --history-max int          limit the maximum number of revisions saved per release. Use 0 for no limit (default 10)
 */
const helmUpgrade = async (deployOptions) => {
  const chartName = deployOptions.chartName.toLowerCase();
  const releaseName = deployOptions.releaseName.toLowerCase();

  _validateNotEmpty(chartName, 'chartName');
  _validateNotEmpty(releaseName, 'releaseName');
  await _gitReady();
  let upgradeCommand = `upgrade ${releaseName} ${chartName}`;
  if (_convertToBool(deployOptions.dryRun)) {
    upgradeCommand += ' --dry-run ';
}
if (_convertToBool(deployOptions.atomic)) {
    upgradeCommand += ' --atomic ';
}
if (_convertToBool(deployOptions.noHooks)) {
    upgradeCommand += ' --no-hooks ';
}
if (_convertToBool(deployOptions.force)) {
    upgradeCommand += ' --force ';
}
if (_convertToBool(deployOptions.install)) {
    upgradeCommand += ' --install ';
}

if (_convertToBool(deployOptions.renderSubchartNotes)) {
    upgradeCommand += ' --render-subchart-notes ';
}

if (_convertToBool(deployOptions.resetValues)) {
    upgradeCommand += ' --reset-values ';
}else if (_convertToBool(deployOptions.reuseValues)) {
    upgradeCommand += ' --reuse-values ';
}
if (_convertToBool(deployOptions.verify)) {
  upgradeCommand += ' --verify ';
}
if (_convertToBool(deployOptions.wait)) {
  upgradeCommand += ' --wait ';
}
if (_convertToBool(deployOptions.cleanupOnFail)) {
  upgradeCommand += ' --cleanup-on-fail ';
}
if (deployOptions.historyMax !== undefined) {
  let num = _validateIntNumber(deployOptions.historyMax);
  num ? upgradeCommand += ' --history-max ' + num + ' ' : "";
}
//version and devel
if(deployOptions.version !== undefined&& deployOptions.version != null && deployOptions.version !== ''){
  upgradeCommand += ` --version ${deployOptions.version}`;
}else{
  if(deployOptions.devel !== undefined&& deployOptions.devel != null && deployOptions.devel !== ''){
    upgradeCommand += '--devel ';
  }else{

  }
}
if(deployOptions.timeout !== undefined&& deployOptions.timeout != null && deployOptions.timeout !== ''){
  upgradeCommand += ` --timeout ${deployOptions.timeout}`;
}else{

}
if(deployOptions.caFile !== undefined&& deployOptions.caFile != null && deployOptions.caFile !== ''){
  upgradeCommand += `--ca-file ${deployOptions.caFile}`;
}else{

}

if(deployOptions.certFile !== undefined&& deployOptions.certFile != null && deployOptions.certFile !== ''){
  upgradeCommand += `--cert-file ${deployOptions.certFile}`;
}else{

}
if(deployOptions.keyFile !== undefined&& deployOptions.keyFile != null && deployOptions.keyFile !== ''){
  upgradeCommand += `--key-file ${deployOptions.keyFile}`;
}else{

}
if(deployOptions.keyring !== undefined&& deployOptions.keyring != null && deployOptions.keyring !== ''){
  upgradeCommand += ` --keyring ${deployOptions.keyring}`;
}else{

}
if(deployOptions.nameTemplate !== undefined&& deployOptions.nameTemplate != null && deployOptions.nameTemplate !== ''){
  upgradeCommand += ` --name-template ${deployOptions.nameTemplate}`;
}else{

}
if(deployOptions.username !== undefined&& deployOptions.username != null && deployOptions.username !== ''){
  upgradeCommand += ` --username ${deployOptions.username}`;
}else{

}
if(deployOptions.password !== undefined&& deployOptions.password != null && deployOptions.password !== ''){
  upgradeCommand += ` --password ${deployOptions.password}`;
}else{

}
if(deployOptions.repo !== undefined&& deployOptions.repo != null && deployOptions.repo !== ''){
  upgradeCommand += ` --repo ${deployOptions.repo}`;
}else{

}
upgradeCommand += _getConfigValues(deployOptions.setString,'set-string');
upgradeCommand += _getConfigValues(deployOptions.setFile,'set-file');
upgradeCommand += _getConfigValues(deployOptions.set,'set');
upgradeCommand += _getCommaArrayValues(deployOptions.values,'f');

if (deployOptions.outputFormat !== undefined&& deployOptions.outputFormat != null && deployOptions.outputFormat !== ''  ) {
  let format = _checkoutputFormatValue(deployOptions.outputFormat);
  if(format){
    upgradeCommand += ' -o '+format+' ';
  }else{
  }
}else{
upgradeCommand += ' -o json ';
}


if(deployOptions.namespace !== undefined&& deployOptions.namespace != null && deployOptions.namespace !== ''){
  upgradeCommand += ` --namespace ${deployOptions.namespace}`;
}else{

}
  return _installOrUpgradeChart(upgradeCommand, deployOptions).then((responseData) => {
    if (responseData && responseData.error) {
      const errLog = `upgrade command failed: ${responseData.data}`;
      console.error(errLog);
      throw new Error(errLog);
    } else if (!responseData) {
      const errLog = 'upgrade command failed: empty response';
      console.error(errLog);
      throw new Error(errLog);
    } else {
      responseData.data = "success";
      return responseData;
    }
  });
}
module.exports = helmUpgrade;
