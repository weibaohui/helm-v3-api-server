const { _executeHelm ,_getRepoPath,_getIndexYamlName,_validateYamlEmpty,_gitReady} = require('../utils/util');
const Git = require('../git/index');
const git = new Git();
/**
 * helm repo index [DIR] [flags]
 * @param {*} repoIndexOptions 
 * helm repo index 
 */
const helmRepoIndex = async (repoIndexOptions,uuid) => {
  const repoPath = _getRepoPath();
  //let repoIndexCommand = `repo index ${repoPath} --merge ${_getIndexYamlName()}`;
  let repoIndexCommand = `repo index ${repoPath}`;
  if(repoIndexOptions.namespace !== undefined&& repoIndexOptions.namespace != null && repoIndexOptions.namespace !== ''){
    repoIndexCommand += ` --namespace ${repoIndexOptions.namespace}`;
  }
  await _gitReady();
   //starting to excute repo index
   let repoIndexResult = await _executeHelm(repoIndexCommand,repoPath);
   if(repoIndexResult.error){
        let errLog = `repo index command failed: ${repoIndexResult.data}`;
        console.error(errLog);
        throw new Error(errLog);
   }else{

   }
   await _validateYamlEmpty();
   await git.add(repoPath);
   await git.commit(repoPath,uuid);
   await git.push(repoPath);
   return {data:"success",excutedCommand:repoIndexCommand};
}
module.exports = helmRepoIndex; 