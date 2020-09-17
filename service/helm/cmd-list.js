const {_convertToBool,_checkoutputFormatValue,_validateIntNumber,_executeHelm} = require('../utils/util');
const helmList=async (listOptions)=>{
    let listCommand = `list`;
      if (_convertToBool(listOptions.all)) {
          listCommand += ' --all ';
      }
      if (_convertToBool(listOptions.allNamespaces)) {
          listCommand += ' --all-namespaces ';
      }
      if (_convertToBool(listOptions.sortByDate)) {
          listCommand += ' --date ';
      }
      if (_convertToBool(listOptions.deployed)) {
          listCommand += ' --deployed ';
      }
      if (_convertToBool(listOptions.failed)) {
          listCommand += ' --failed ';
      }
      if (_convertToBool(listOptions.pending)) {
          listCommand += ' --pending ';
      }
      if (_convertToBool(listOptions.reverse)) {
          listCommand += ' --reverse ';
      }
      if (_convertToBool(listOptions.short)) {
          listCommand += ' --short ';
      }
      if (_convertToBool(listOptions.superseded)) {
          listCommand += ' --superseded ';
      }
      if (_convertToBool(listOptions.uninstalled)) {
          listCommand += ' --uninstalled ';
      }
      if (_convertToBool(listOptions.uninstalling)) {
          listCommand += ' --uninstalling ';
      }
      
      if (listOptions.filter !== undefined&& listOptions.filter != null && listOptions.filter !== '' ) {
          listCommand += ' --filter '+ listOptions.filter;
      }
      if (listOptions.outputFormat !== undefined&& listOptions.outputFormat != null && listOptions.outputFormat !== ''  ) {
          let format = _checkoutputFormatValue(listOptions.outputFormat);
          if(format){
            listCommand += ' -o '+format+' ';
          }else{
          }
      }else{
        listCommand += ' -o json ';
      }
      if (listOptions.max !== undefined&& listOptions.max != null && listOptions.max !== '') {
        let num = _validateIntNumber(listOptions.max);
        num?listCommand += ' --max '+num+' ':"";
    }
    if (listOptions.offset !== undefined && listOptions.offset != null && listOptions.offset !== '') {
      let num = _validateIntNumber(listOptions.offset);
      num?listCommand += ' --offset '+num+' ':"";
  }
  if(listOptions.namespace !== undefined&& listOptions.namespace != null && listOptions.namespace !== ''){
    listCommand += ` --namespace ${listOptions.namespace}`;
    return await _executeHelm(listCommand);
  }else if(listOptions.namespaces !== undefined&& listOptions.namespaces != null && listOptions.namespaces !== '' 
  
  ){
    let namespaces = JSON.parse(listOptions.namespaces);
    if(typeof namespaces === "object" && namespaces.length>0){
        let multiCommandResult = {data:[],excutedCommand:[],error:false};
        let resultFlag = namespaces.length;
        return await new Promise((resolve,reject)=>{
            namespaces.forEach(async (item,index)=>{
                //listCommand += ` --namespace ${item}`;
                let result = await _executeHelm(listCommand + ` --namespace ${item}`);
                if(result.error){
                    multiCommandResult.error = true;
                    multiCommandResult.data.push(result.data);
                    multiCommandResult.excutedCommand.push(result.excutedCommand);
                }else{
                    multiCommandResult.data = multiCommandResult.data.concat(JSON.parse(result.data));
                    multiCommandResult.excutedCommand = multiCommandResult.excutedCommand.concat(result.excutedCommand);
                }
                resultFlag --;
                if(resultFlag=== 0){
                    multiCommandResult.data = JSON.stringify(multiCommandResult.data);
                    multiCommandResult.excutedCommand = JSON.stringify(multiCommandResult.excutedCommand);
                    resolve(multiCommandResult) ; 
                }
            })
        })
        
    }else{
        const errorMsg = `namespaces need to be a valid array`;
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
    }else{
        return await _executeHelm(listCommand);
    }
     
  }
  module.exports = helmList;
