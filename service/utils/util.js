const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const gitConfig = require('../../config/index').git;
const Git = require('../git/index');
const git = new Git();
const helmBinaryLocation = process.env.HELM_BINARY;
const log = require('./logger');
const logger = log.getLogger("app");
function _validateNotEmpty(arg, argName) {
  if (typeof arg === 'undefined' || arg === null || arg === '') {
    const errorMsg = `${argName} is required`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}
function _validateBoolean(arg, argName) {
  if (typeof arg === Boolean || arg === "false" || arg === "true") {
    const errorMsg = `${argName} need to be a boolean value`;
    throw new Error(errorMsg);
  }
}
function _checkoutputFormatValue(arg) {
  if (typeof arg === String) {
    if (arg === 'yaml') {
      return 'yaml'
    } else if (arg === 'table') {
      return false;
    } else {
      return 'json';
    }
  } else {
    return false;
  }
}
function _findFirstService(json) {
  const service = json.resources.find(el => el.name.toLowerCase().includes('/service'));
  return (service && service.resources[0]) || null;
}
function _validateIntNumber(obj) {
  var reg = /^[1-9]+[0-9]*]*$/; //判断字符串是否为数字 ，判断正整数用/^[1-9]+[0-9]*]*$/
  if (reg.test(obj)) {
    return obj;
  } else {
    return false;
  }
}
function _convertToBool(obj) {
  if (obj == null) {
    return false;
  }

  // will match one and only one of the string 'true','1', or 'on' regardless
  // of capitalization and regardless of surrounding white-space.
  //
  const regex = /^\s*(true|1|on)\s*$/i;

  return regex.test(obj.toString());
}
function _getConfigValues(deployObject,flag) {
  if ( deployObject === undefined || deployObject === "" || deployObject == null) {
    return '';
  }
  if(typeof deployObject === "object"){

  }else{
    deployObject = JSON.parse(deployObject);
  }
  let configStr = '';
  for (const attribute in deployObject) {
    if (deployObject.hasOwnProperty(attribute)) {
      configStr += ` --${flag} ${attribute}=${deployObject[attribute]}`;
    }
  }
  return configStr;
}
function _getArrayValues(deployObject,flag) {
  return '';

}
function _getCommaArrayValues(deployObject,flag){
  if ( deployObject === undefined || deployObject === "" || deployObject == null) {
    return '';
  }
  let arr = deployObject.split(",");
  let configStr = '';
  arr.forEach(element => {
    configStr += ` -${flag} ${element}`;
  });
  return configStr;
}
async function _executeHelm(command ,path) {
  try {
    logger.info(`command: ${helmBinaryLocation} ${command}`);
    const { stdout, stderr } = await exec(`${helmBinaryLocation} ${command}`,{cwd:path});
  let data ;
  let err = false;
  if(stderr){
    err = true;
    data = stderr;
  }else{
    data = stdout;
  }
  return { data: data, error: err,excutedCommand:`${helmBinaryLocation} ${command}` };
  } catch (error) {
    return { data: "excute command occured error :"+error.toString(), error: true,excutedCommand:`${helmBinaryLocation} ${command}` };
  }
  
}
async function _installOrUpgradeChart(command, deployOptions) {
  let updatedCmd = command;
  const chartName = deployOptions.chartName.toLowerCase();

  // when requesting install from a private repository,
  // helm repositories list must be updated first
  if (deployOptions.privateChartsRepo) {
    const tokens = chartName.split('/');
    // adds the private repo to helm known repos
    await _executeHelm(`repo add ${tokens[0]} ${deployOptions.privateChartsRepo}`);
    // fetch the data from all known repos
    await _executeHelm('repo update');
  }
  // install the chart from one of the known repos
  const repoPath = _getRepoPath();
  return _executeHelm(updatedCmd,repoPath);
}
function _getUserInfo(){
  let obj = {
    username:gitConfig.username,
    email:gitConfig.email
  }
  return obj;
}
function _getRepoRootPath (){
  return gitConfig.baseFolderPath;
}
function _getGitRepoUrl(){
  return gitConfig.repoUrl;
}
function _getIndexYamlName(){
  return gitConfig.yamlName;
}
function _getProjectFolderName(){
  if(gitConfig.projectFolderName=="" ||gitConfig.projectFolderName==undefined || gitConfig.projectFolderName==null ||gitConfig.projectFolderName==" "){
    return "defaultProject";
  }else{
    return gitConfig.projectFolderName;
  }
  
}
function _getRepoPath(){
  let path = gitConfig.baseFolderPath;
  //let repoName = gitConfig.repoUrl.split("/");
  //return path += '/'+repoName[repoName.length-1];
  let repoName = gitConfig.projectFolderName;
  return path += '/' + repoName;
}
function __getStat(path){
  return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
          if(err){
              resolve(false);
          }else{
              resolve(stats);
          }
      })
  })
}
function __mkdir(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (__mkdir(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}
async function __dirExists(dir){
    let isExists = await __getStat(dir);
    //如果该路径且不是文件，返回true
    if(isExists && isExists.isDirectory()){
        return true;
    }else if(isExists){     //如果该路径存在但是文件，返回false
        return false;
    }
    return await __mkdir(dir);
}
async function _checkRepoExist(){
  if(await __dirExists(gitConfig.baseFolderPath)){

  }else{
    throw new Error("/data is a file ,not a directory")
  }
  let repoBasePath = _getRepoPath();
  return await new Promise((resolve, reject) => {
    fs.stat(repoBasePath, function(err, stats) {
      err?resolve(false):resolve(true)
    });
  })
}
function _validateYamlEmpty(){
  let repoBasePath = _getRepoPath();
  //read yaml file
  const file = fs.readFileSync(repoBasePath+'/'+gitConfig.yamlName, 'utf8');
  const yamlJson = YAML.parse(file);

  if(Object.keys(yamlJson.entries).length>0){
    
  }else{
    logger.info(Object.keys(yamlJson.entries))
    const errorMsg = `generated an empty yaml! check your repo please!`;
    throw new Error(errorMsg);
  }
}
async function _gitReady(){
  const repoPath = _getRepoPath();
  if(await _checkRepoExist()){
      //git pull
   let pullResult = await git.pull(repoPath);
   if(pullResult.error){
       let errLog = `git pull command failed: ${pullResult.data}`;
       console.error(errLog);
       throw new Error(errLog);
   }else{
       //excute repo index
       return pullResult;
   }
  }else{
   //repo not exist ,clone repo before other operation
   let cloneResult = await git.clone(_getGitRepoUrl(),_getProjectFolderName(),_getRepoRootPath());
   if(cloneResult.error){
       let errLog = `git clone command failed: ${cloneResult.data}`;
       console.error(errLog);
       throw new Error(errLog);
   }else{
       //excute repo index
       return cloneResult;
   }
  }

}
async function _gitInit(){
  await git.init(_getUserInfo());
  await _gitReady();
}
async function _gitPullApi(){
  return await _gitReady();
}
module.exports = {
  _validateNotEmpty: _validateNotEmpty,
  _validateBoolean: _validateBoolean,
  _checkoutputFormatValue: _checkoutputFormatValue,
  _findFirstService: _findFirstService,
  _validateIntNumber: _validateIntNumber,
  _convertToBool: _convertToBool,
  _getConfigValues: _getConfigValues,
  _getArrayValues:_getArrayValues,
  _getCommaArrayValues:_getCommaArrayValues,
  _executeHelm: _executeHelm,
  _installOrUpgradeChart: _installOrUpgradeChart,
  _getRepoRootPath:_getRepoRootPath,
  _getGitRepoUrl:_getGitRepoUrl,
  _getIndexYamlName:_getIndexYamlName,
  _validateYamlEmpty:_validateYamlEmpty,
  _checkRepoExist:_checkRepoExist,
  _getRepoPath:_getRepoPath,
  _getProjectFolderName:_getProjectFolderName,
  _getUserInfo:_getUserInfo,
  _gitReady:_gitReady,
  _gitInit:_gitInit,
  _gitPullApi:_gitPullApi
}