const express = require('express');
const app = express();
const morgan = require('morgan');

const PORT = 4838;

app.use(morgan());

app.use('/api/user', require('./services/user'));
app.use('/api/highscores', require('./services/highscores'));

app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  res.header('Content-Type', 'text/plain');
  res.status(500);
  res.send(err.stack);
});

app.listen(PORT, () => console.log(`${require('fs').readFileSync('./ascii')}
Listening on ${PORT}`));