'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const port = process.env.PORT || 9000;

app.use(express.static(path.join(__dirname, '../client')));

app.get('/documents/:index', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    let document = JSON.parse(data);
    const { url } = req;
    const { documents: { length } } = document;
    const { index } = req.params;
    const inRange = index >= 1 && index <= length;

    if (!inRange) {
      res.set('Content-Type', 'text/plain');
      res.status(404).send('404 - Not Found').end();
      return;
    }

    const paragraph = document.documents[index - 1];

    res.set('Content-Type', 'text/plain');
    res.status(200).send(paragraph).end();
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + 'client/index.html'));
});

app.listen(port);