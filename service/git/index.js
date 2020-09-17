const util = require('util');
const exec = util.promisify(require('child_process').exec);
const log = require('../utils/logger');
const logger = log.getLogger("app");
class Git {
  async init(userInfo){
    let {username,email} = userInfo;
    let setUsername = `config --global user.username ${username}`;
    let setUserEmail = `config --global user.email ${email}`;
    await Git._excuteGit(setUserEmail);
    await Git._excuteGit(setUsername);
   }
  static async  _excuteGit(command,commandPath) {
    //logger.info(command,commandPath)
    let exCommand = `git ${command}`;
    const { stdout, stderr } = await exec(exCommand,{cwd:commandPath});
    logger.debug(stdout)
    logger.debug(stderr)
    let data ;
    let err = false;
    if(stderr.indexOf('fatal')>-1 || stderr.indexOf('error')>-1){
      err = true;
      data = stderr;
    }else{
      data = stderr;
    }
    return { data: data, error: err,excutedCommand:`${exCommand}` };
    
  }

    async clone(gitRepoUrl,projectFolderName,gitRepoRootPath) {
      //get clone url
      let command = `clone ${gitRepoUrl} ${projectFolderName}`;
      return await Git._excuteGit(command,gitRepoRootPath);

    }
    async pull(repoPath) {
     let command = `pull --force`;
     return await Git._excuteGit(command,repoPath);
    }
    async add(repoPath){
      let command = `add .`;
     return await Git._excuteGit(command,repoPath);
    }
    async commit(repoPath,id){
      let command = `commit -m 'generated newest index.yaml by helm-api-server ,request id is:${id}' `;
      return await Git._excuteGit(command,repoPath);
    }
    async push(repoPath){
      let command = `push `;
      return await Git._excuteGit(command,repoPath)
    }
   
  }
  
module.exports = Git;
  