const { _executeHelm, _validateNotEmpty,_getRepoPath,_convertToBool,_gitReady } = require('../utils/util');
/**
 * helm repo search KEYWORD [flags]
 * devel string
 * outputFormat
 * regexp
 * version string
 * versions
 */
const helmShowChart =async (showChartOptions)=>{
  let showChartCommand = 'show chart ';
  await _gitReady();
  const repoPath = _getRepoPath();
  _validateNotEmpty(showChartOptions.chartName,"chartName");
  showChartCommand += showChartOptions.chartName;
  if (_convertToBool(showChartOptions.verify)) {
    showChartCommand += ' --verify ';
  }
  if(showChartOptions.version !== undefined&& showChartOptions.version != null && showChartOptions.version !== ''){
    showChartCommand += ` --version ${showChartOptions.version}`;
  }
  if(showChartOptions.caFile !== undefined&& showChartOptions.caFile != null && showChartOptions.caFile !== ''){
    showChartCommand += `--ca-file ${showChartOptions.caFile}`;
  }

  if(showChartOptions.certFile !== undefined&& showChartOptions.certFile != null && showChartOptions.certFile !== ''){
    showChartCommand += `--cert-file ${showChartOptions.certFile}`;
  }
  if(showChartOptions.keyFile !== undefined&& showChartOptions.keyFile != null && showChartOptions.keyFile !== ''){
    showChartCommand += `--key-file ${showChartOptions.keyFile}`;
  }
  if(showChartOptions.keyring !== undefined&& showChartOptions.keyring != null && showChartOptions.keyring !== ''){
    showChartCommand += ` --keyring ${showChartOptions.keyring}`;
  }
  if(showChartOptions.username !== undefined&& showChartOptions.username != null && showChartOptions.username !== ''){
    showChartCommand += ` --username ${showChartOptions.username}`;
  }
  if(showChartOptions.password !== undefined&& showChartOptions.password != null && showChartOptions.password !== ''){
    showChartCommand += ` --password ${showChartOptions.password}`;
  }
  if(showChartOptions.repo !== undefined&& showChartOptions.repo != null && showChartOptions.repo !== ''){
    showChartCommand += ` --repo ${showChartOptions.repo}`;
  }

if(showChartOptions.namespace !== undefined&& showChartOptions.namespace != null && showChartOptions.namespace !== ''){
  showChartCommand += ` --namespace ${showChartOptions.namespace}`;
}
  let showChartResult = await _executeHelm(showChartCommand,repoPath);
    if(showChartResult.error){
    return showChartResult;
    }else{
      let lines = showChartResult.data.split("\n");
      let showChartResultObj = {}
      lines.forEach((line)=>{
        if(line.length>0 && line!== "" && line !== undefined && line != null){
          let temp = line.split(":");
          showChartResultObj[temp[0]] = temp[1];
        }else{

        }
        
      })
      return {
        data:JSON.stringify(showChartResultObj),
        excutedCommand: showChartResult.excutedCommand
      }
    }
  
}
module.exports = helmShowChart;