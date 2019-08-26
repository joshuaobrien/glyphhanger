const express = require('express');
const cors = require('cors');
const subsetFunc = require('./main')
const app = express();
const port = 1989;

app.use(cors());

app.get('/subset', (req, res) => {
  const id = req.query.id;
  const whitelist = req.query.whitelist;
  if (!id || !whitelist) {
    res.status(403).end();
  }

  const font = subsetFunc(whitelist, id);

  res.send(font);
});

app.use('/fonts', express.static('fonts'));

app.listen(port, () => console.log(`Font subsetter listening on port ${port}`));
