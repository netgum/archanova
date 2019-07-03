const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const logger = require('./logger');
const { get, post } = require('./handlers');

const app = express();
const server = createServer(app);

app.get('/', (req, res, next) => {
  try {
    const data = get();
    res.send(data);
  } catch (err) {
    next(err);
  }
});
app.post('/', bodyParser.json({}), (req, res, next) => {
  try {
    post(req.body)
      .then((data) => {
        if (!data) {
          res.status(400);
          res.send({
            error: 'bad request',
          });
        } else {
          res.send(data);
        }
      })
      .catch(next);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  logger.error('request error', err);

  res.status(500);
  res.send({
    error: 'internal server error',
  });
});

server.listen(config.server.port, (err) => {
  if (err) {
    logger.error('server error', err);
  } else {
    const { port } = server.address();

    logger.info('listening on port:', port);
  }
});



