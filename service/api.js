const express = require('express');
const { v4   } = require('uuid');

const { helmHistory, helmList, helmDelete, helmInstall, helmUpgrade, 
    helmRepoUpdate, helmGetManifest, helmSearchRepo, helmStatus,
    helmRollback,helmRepoIndex,helmShowChart,
    helmPackage } = require('./helm/index');
const {_gitPullApi} = require('./utils/util');
const log = require('./utils/logger');
const logger = log.getLogger("app");
const router = express.Router();
let prefix = process.env.apiPrefix ? process.env.apiPrefix : "";
// Helm functionallity
/**
 * Installs the requested chart into the Kubernetes cluster
 */
const resultFormat = (data, excutedCommand) => {
    let result = {};
    result.data = data;
    excutedCommand ? result.excutedCommand = excutedCommand : "";
    return result;
}
router.use(function (req, res, next) {
    req.uuid = v4();
    let enterTimeStamp = Date.now();
    req.enterTimeStamp = enterTimeStamp;
    logger.info({id:req.uuid,url:req.url,params:req.body})
    next();
  });
  router.use(function (req, res, next) {
    let options = req.body;
    if (typeof options === 'object') {

    } else {

    }
    if (Object.keys(options).length > 0) {

    } else {
        options = {}
    }
    req.body = options;
    next();
  });
router.post(prefix + '/install',
    async (req, res) => {
        const deployOptions = req.body;
        await helmInstall(deployOptions)
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {
                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`Chart installation failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });
/**
 * Upgrades an already installed chart, identified by its release name
 */
router.post(prefix + '/upgrade',
    async (req, res) => {
        const deployOptions = req.body;
        await helmUpgrade(deployOptions)
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {
                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`Chart upgrade failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });

/**
 * Deletes an already installed chart, identified by its release name
 */
router.post(prefix + '/delete',
    async (req, res) => {
        const delOptions = req.body;
        await helmDelete(delOptions)
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {
                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`Chart delete failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });

/**
 * helm list
 */
router.post(prefix + '/list',
    async (req, res) => {
        const listOptions = req.body;
        await helmList(listOptions)
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {
                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`helm list failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });
/**
 * helm package
 */
router.post(prefix + '/package',
    async (req, res) => {
        const packageOptions = req.body;
        await helmPackage(packageOptions)
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {
                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`helm package failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });
/**
* helm history RELEASENAME [flags]
* --max
* --outputFormat
*/
router.post(prefix + '/history',
    async (req, res) => {
        const historyOptions = req.body;
        await helmHistory(historyOptions)
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {
                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`helm history failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });
/**
* helm repoUpdate
*/
router.post(prefix + '/repoUpdate',
    async (req, res) => {
        const repoUpdateOptions = req.body;
        await helmRepoUpdate(repoUpdateOptions)
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {
                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`helm repo update failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });
/**
* helm repo index
*/
router.post(prefix + '/repoIndex',
    async (req, res) => {
        const repoIndexOptions = req.body;
        await helmRepoIndex(repoIndexOptions,req.uuid)
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {
                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`helm repo index failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });
/**
* helm repo search keyword [flag]
* devel string
* outputFormat
* regexp
* version string
* versions
*/
router.post(prefix + '/searchRepo',
    async (req, res) => {
        const searchRepoOptions = req.body;
        await helmSearchRepo(searchRepoOptions)
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {
                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`helm search repo failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });
/**
* helm get manifest REALEASE_NAME [flags]
* --revision int get the named release with revision
*/
router.post(prefix + '/getManifest',
    async (req, res) => {
        const getManifestOptions = req.body;
        await helmGetManifest(getManifestOptions)
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {
                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`helm get manifest failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });
/**
* helm status RELEASE [revision] [flags]
* --cleanup-on-fail
* --dry-run
* --force
* --no-hooks
* --recreate-pods
* --timeout (default 5m5s)
* --wait combined with timeout
*/
router.post(prefix + '/status',
    async (req, res) => {
        const statusOptions = req.body;
        await helmStatus(statusOptions)
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {
                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`helm status failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });

/**
* helm rollback RELEASE [revision] [flags]
* --cleanup-on-fail
* --dry-run
* --force
* --no-hooks
* --recreate-pods
* --timeout (default 5m5s)
* --wait combined with timeout
*/
router.post(prefix + '/rollback',
    async (req, res) => {
        const rollbackOptions = req.body;
        await helmRollback(rollbackOptions)
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {
                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`helm rollback failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });
router.post(prefix + '/showChart',
    async (req, res) => {
        const showChartOptions = req.body;
        await helmShowChart(showChartOptions)
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {
                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`helm show chart failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });
/**
 * git pull --force _gitPull
 */
router.post(prefix + '/gitPull',
    async (req, res) => {
        //const showChartOptions = req.body;
        await _gitPullApi()
            .then((response) => {
                if (response.error) {
                    res.statusCode = 400;
                } else {

                }
                let result = resultFormat( response.data,response.excutedCommand);
                res.send(result);
            }).catch((err) => {
                logger.error(`git pull api failed with exception :${err.toString()}`);
                res.statusCode = 500;
                let result = resultFormat(err.toString());
                res.send(result);
            }).finally(()=>{
                let leaveTime = Date.now();
                logger.info({id:req.uuid,url:req.url,totalTimeCost:leaveTime - req.enterTimeStamp})
            });
    });
module.exports = router;