const fs = require('fs-extra');
const request = require('request-promise-native');
const child_process = require('child_process');
const cleanData = require('./clean-data').default;

fs.removeSync('./wikia-data');
fs.removeSync('./wikia-data-json');

fs.ensureDir('./wikia-data').then(() => fs.emptyDir('./wikia-data')).then(() =>
  request('http://warframe.wikia.com/wiki/Module:Weapons/data?action=raw')).then(body => {

  fs.writeFileSync('./wikia-data/weapondata.lua', body);
  child_process.exec('cmd /c lua ./wikia-scripts/clean.lua', (err, cout, cerr) => {
    if(err) { console.error(err); return; }
    if(cout)
      console.log(cout);
    if(cerr)
      console.error(cerr);
    if(!cerr && !err) {
      cleanData().then(() => {
        return fs.remove('./wikia-data');
      }).catch(e => console.error(e));
    }
  });
}).catch(e => console.error(e));
