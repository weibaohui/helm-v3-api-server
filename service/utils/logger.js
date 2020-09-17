const log4js = require("log4js");
const path = require("path");
const fs = require("fs-extra");
const config = require("../../config/index").log;
function readAllFiles(dir) {
  const files = fs.readdirSync(dir);
  const certs = [];
  files.forEach(file_name => {
    const file_path = path.join(dir, file_name);
    const data = fs.readFileSync(file_path);
    certs.push(data);
  });
  return certs;
}

var getLogger = function(moduleName) {
  if (moduleName == "app") {
    var logger = log4js.getLogger("app");
  } else{
    var logger = log4js.getLogger("app");
  }
  var appLog = "logs/app/app.log";
  if (process.env.SYNC_LOG_PATH) {
    var appLog = `${process.env.SYNC_LOG_PATH}/app/app.log`;
  }
  fs.ensureFileSync(appLog);
  log4js.configure({
    appenders: {
      app: { type: "dateFile", filename: appLog, pattern: "-yyyy-MM-dd",daysToKeep:7 },
    },
    categories: {
      app: { appenders: ["app"], level: config.loglevel },
      default: { appenders: ['app'], level: 'error' }
    }
  });
  return logger;
};

exports.getLogger = getLogger;
exports.readAllFiles = readAllFiles;
