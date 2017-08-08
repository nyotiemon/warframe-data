const fs = require('fs-extra');
const request = require('request-promise-native');
const child_process = require('child_process');
const cleanData = require('./clean-data').default;
const toJS = require('./jslib/js-lua').toJS;

const rootDir = './fetch-lua-data';
fs.removeSync(rootDir);

request('http://warframe.wikia.com/wiki/Module:Weapons/data?action=raw').then(body => {

  const match = body.match(/{(?:.|\n)+}/);
  if(!match) throw new Error('No match!');

  const table = match[0];
  const obj = toJS(table);

  return cleanData(obj);
}).catch(e => console.error(e));
