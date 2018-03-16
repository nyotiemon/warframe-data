/*jshint esversion: 6 */

const fs = require('fs-extra');
const request = require('request-promise-native');
// const child_process = require('child_process');
const cleanData = require('./clean-data').default;
const toJS = require('./jslib/js-lua').toJS;

const rootDir = './fetch-lua-data';
fs.removeSync(rootDir);

request('http://warframe.wikia.com/wiki/Module:Weapons/data?action=raw').then(body => {

  const match = body.match(/{(?:.|\n)+}/);
  if(!match) throw new Error('No match!');

  const wow = '{\n' +
    '--Special list of things to be ignored when counting\n' +
    '--Currently just for Dark Split-Sword & Rampart, but may be needed again later\n' +
    '--Pretty much used to avoid screwing up the Mastery Rank list\n' +
    '["IgnoreInCount"] = {"Rampart", "Dark Split-Sword (Heavy Blade)"},\n' +
    '["Weapons"] = {\n' +
    '["Angstrum"] = {\n' +
    'Name = "Angstrum",\n' +
    'SecondaryAreaAttack = {--wrong attack type for the sake of order\n' +
    'AttackName = "3-Rocket Barrage Impact",\n' +
    'ShotSpeed = 150,},\n' +
    'SecondaryAttack = {--wrong attack type for the sake of order\n' +
    'AttackName = "3-Rocket Barrage Explosion",\n' +
    'Radius = 3,},\n' +
    'Users = {"[[Comba]]", "[[Scrambus]]", "[[Pelna Cade]]", "[[Jad Teran]]"},\n' +
    '}}}\n';


  const table = match[0];
  const obj = toJS(table);

  return cleanData(obj);
}).catch(e => console.error(e));
