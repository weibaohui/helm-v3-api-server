const config = {
  "name": "helm-api-server",
  "port": 4000,
  "log":{
    "loglevel":"info"
  },
  "git":{
    "repoUrl":"http://helm:12345678@localhost/helm/repo",//user, password git url
    "baseFolderPath":"/data/helm-repo",//clone git project under this directory.no need to change normally.
    "projectFolderName":"paas-helm",//default value is defaultProject
    "yamlName":"index.yaml",//helm default yaml name .no need to change normally.
    "username":"helm-api-server",//which name appear on gitlab commit info .
    "email":"helm-api-server@admin.com"//which email appear on gitlab commit info.
  }
}
module.exports= config;