#! /usr/bin/env node
const cli = require('cli');
const j2f = require('../src');

cli.withStdin(jsonStr => {
  const obj = JSON.parse(jsonStr);
  console.log(j2f(obj));
});
