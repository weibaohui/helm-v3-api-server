const {_convertToBool,_checkoutputFormatValue,_validateNotEmpty,_installOrUpgradeChart,
  _findFirstService,_getConfigValues,_getArrayValues,_gitReady,_getCommaArrayValues} = require('../utils/util');
/**
 * Installs the requested chart into the Kubernetes cluster
 * helm install [NAME] [CHART] [flags]
 * --atomic                   if set, installation process purges chart on fail. The --wait flag will be set automatically if --atomic is used
 * --dependency-update        run helm dependency update before installing the chart
 * --devel                    use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored
 * --disable-openapi-validation if set,the installation process will not validate rendered templates against the k8s openAPI Schema
 * --dry-run                  simulate an install
 * --no-hooks                 prevent hooks from running during install
 * --generate-name            generate the name (and omit the NAME parameter)
 * --render-subchart-notes    if set, render subchart notes along with the parent
 * --replace                  re-use the given name, only if that name is a deleted release which remains in the history. This is unsafe in production
 * --skip-crds                if set, no CRDs will be installed. By default, CRDs are installed if not already present
 * --verify                   verify the package before installing it
 * --wait                     if set, will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful. It will wait for as long as --timeout
 * --timeout duration         time to wait for any individual Kubernetes operation (like Jobs for hooks) (default 5m0s)
 * --ca-file string           verify certificates of HTTPS-enabled servers using this CA bundle
 * --cert-file string         identify HTTPS client using this SSL certificate file
 * --key-file string          identify HTTPS client using this SSL key file
 * --keyring string           location of public keys used for verification (default "~/.gnupg/pubring.gpg")
 * --name-template string     specify template used to name the release
 * --password string          chart repository password where to locate the requested chart
 * --repo string              chart repository url where to locate the requested chart
 * --set stringArray          set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
 * --set-file stringArray     set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)
 * --set-string stringArray   set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
 * --username string          chart repository username where to locate the requested chart
 * --values strings           specify values in a YAML file or a URL(can specify multiple)
 * --version string           specify the exact chart version to install. If this is not specified, the latest version is installed
 * privateChartsRepo
 */
const helmInstall=async (deployOptions)=>{
    const chartName = deployOptions.chartName.toLowerCase();
    const { releaseName } = deployOptions;
    let installCommand ='install ';
    await _gitReady();
    _validateNotEmpty(chartName, 'chartName');
    if (releaseName !== undefined && releaseName != null && releaseName !== '') {
      installCommand += `${releaseName.toLowerCase()} ${chartName}`;
    }else{
      
      if (_convertToBool(deployOptions.generateName)) {
          
      }else{
        const errLog = 'must either provide a name or specify --generate-name';
        console.error(errLog);
        throw new Error(errLog);
      }
     
    }

      if (_convertToBool(deployOptions.generateName)) {
        installCommand += `${chartName} --generate-name `;
        }
        if (_convertToBool(deployOptions.dryRun)) {
            installCommand += ' --dry-run ';
        }
        if (_convertToBool(deployOptions.atomic)) {
            installCommand += ' --atomic ';
        }
        if (_convertToBool(deployOptions.noHooks)) {
            installCommand += ' --no-hooks ';
        }
        if (_convertToBool(deployOptions.dependencyUpdate)) {
            installCommand += ' --dependency-update ';
        }
        if (_convertToBool(deployOptions.disableOpenapiValidation)) {
            installCommand += ' --disable-openapi-validation ';
        }

        if (_convertToBool(deployOptions.renderSubchartNotes)) {
            installCommand += ' --render-subchart-notes ';
        }

        if (_convertToBool(deployOptions.replace)) {
            installCommand += ' --replace ';
        }
        if (_convertToBool(deployOptions.skipCrds)) {
            installCommand += ' --skip-crds ';
        }
        if (_convertToBool(deployOptions.verify)) {
          installCommand += ' --verify ';
        }
        if (_convertToBool(deployOptions.wait)) {
          installCommand += ' --wait ';
        }
        //version and devel
        if(deployOptions.version !== undefined&& deployOptions.version != null && deployOptions.version !== ''){
          installCommand += ` --version ${deployOptions.version}`;
        }else{
          if(deployOptions.devel !== undefined&& deployOptions.devel != null && deployOptions.devel !== ''){
            installCommand += '--devel ';
          }else{

          }
        }
        if(deployOptions.timeout !== undefined&& deployOptions.timeout != null && deployOptions.timeout !== ''){
          installCommand += ` --timeout ${deployOptions.timeout}`;
        }else{

        }
        if(deployOptions.caFile !== undefined&& deployOptions.caFile != null && deployOptions.caFile !== ''){
          installCommand += `--ca-file ${deployOptions.caFile}`;
        }else{

        }

        if(deployOptions.certFile !== undefined&& deployOptions.certFile != null && deployOptions.certFile !== ''){
          installCommand += `--cert-file ${deployOptions.certFile}`;
        }else{

        }
        if(deployOptions.keyFile !== undefined&& deployOptions.keyFile != null && deployOptions.keyFile !== ''){
          installCommand += `--key-file ${deployOptions.keyFile}`;
        }else{

        }
        if(deployOptions.keyring !== undefined&& deployOptions.keyring != null && deployOptions.keyring !== ''){
          installCommand += ` --keyring ${deployOptions.keyring}`;
        }else{

        }
        if(deployOptions.nameTemplate !== undefined&& deployOptions.nameTemplate != null && deployOptions.nameTemplate !== ''){
          installCommand += ` --name-template ${deployOptions.nameTemplate}`;
        }else{

        }
        if(deployOptions.username !== undefined&& deployOptions.username != null && deployOptions.username !== ''){
          installCommand += ` --username ${deployOptions.username}`;
        }else{

        }
        if(deployOptions.password !== undefined&& deployOptions.password != null && deployOptions.password !== ''){
          installCommand += ` --password ${deployOptions.password}`;
        }else{

        }
        if(deployOptions.repo !== undefined&& deployOptions.repo != null && deployOptions.repo !== ''){
          installCommand += ` --repo ${deployOptions.repo}`;
        }else{

        }
        installCommand += _getConfigValues(deployOptions.setString,'set-string');
        installCommand += _getConfigValues(deployOptions.setFile,'set-file');
        installCommand += _getConfigValues(deployOptions.set,'set');
        installCommand += _getCommaArrayValues(deployOptions.values,'f');
        if (deployOptions.outputFormat !== undefined&& deployOptions.outputFormat != null && deployOptions.outputFormat !== ''  ) {
          let format = _checkoutputFormatValue(deployOptions.outputFormat);
          if(format){
            installCommand += ' -o '+format+' ';
          }else{
          }
      }else{
        installCommand += ' -o json ';
      } 
        if(deployOptions.namespace !== undefined&& deployOptions.namespace != null && deployOptions.namespace !== ''){
          installCommand += ` --namespace ${deployOptions.namespace}`;
        }
    return _installOrUpgradeChart(installCommand, deployOptions)
      .then((responseData) => {
        if (responseData && responseData.error) {
          const errLog = `Install command failed: ${responseData.data}`;
          throw new Error(errLog);
        } else if (!responseData) {
          const errLog = 'Install command failed: empty response';
          throw new Error(errLog);
        } else {
          responseData.data = "success";
          return responseData;
        }
      });
  }
module.exports = helmInstall;