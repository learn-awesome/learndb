// import pkg from './db/topics.js';
// const { topics } = pkg;

import { topics } from './db/topics.js';

// const { topics } = require('./db/topics.js');

const topics_db = topics.trimStart().trimEnd().split('\n').map(j => JSON.parse(j));

// const express = require('express')
import express from 'express';

const app = express()
const port = 8080

app.use(express.static('static'))

app.get('/topicjson', (req, res) => {
    res.type('json')
    res.send(JSON.stringify(topics_db))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})