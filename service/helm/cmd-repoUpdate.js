const { _executeHelm } = require('../utils/util');
const helmRepoUpdate = async (repoUpdateOptions) => {
  let repoUpdateCommand = 'repo update ';
  if(repoUpdateOptions.namespace !== undefined&& repoUpdateOptions.namespace != null && repoUpdateOptions.namespace !== ''){
    repoUpdateCommand += ` --namespace ${repoUpdateOptions.namespace}`;
  }
  return await _executeHelm(repoUpdateCommand);
}
module.exports = helmRepoUpdate; 