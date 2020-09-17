const express = require('express');
const bodyParser = require('body-parser');
const appconfig = require("./config/index");
const apiRouter = require("./service/api");
const {_gitInit} = require("./service/utils/util");
const app = express();
const router = new express.Router();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(router);
app.use(apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found Api');
  err.status = 404;
  next(err);
});

app.set('port', process.env.PORT || appconfig.port);

const server = app.listen(app.get('port'), async () => {
  await _gitInit();
  console.log(`Server listening on port ${server.address().port}`);
    
  
});
