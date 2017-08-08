const fs = require('fs-extra');
const js2lua = require('./jslib/js2lua');

const useKeysDirs = [
  /^Weapons$/
];

if(!fs.existsSync('./wikia-data-json')) return;

const bigObj = {};

const dir = fs.readdirSync('./wikia-data-json');
for(const file of dir) {

  const stat = fs.lstatSync('./wikia-data-json/' + file);
  const useKeys = useKeysDirs.findIndex(a => a.test(file)) >= 0;

  bigObj[file] = useKeys ? {} : [];

  if(stat.isDirectory()) {
    const subdir = fs.readdirSync('./wikia-data-json/' + file);

    for(const subfile of subdir) {
      if(!/\.json$/.test(subfile)) continue;

      const json = fs.readJsonSync('./wikia-data-json/' + file + '/' + subfile);
      if(useKeys) {
        bigObj[file][json.Name] = json;
      } else {
        bigObj[file].push(json);
      }
    }
  }
}

const luatable = js2lua.convert(bigObj, 5);
fs.ensureDir('./wikia-data').then(() => {
  fs.writeFileSync('./wikia-data/weapon-data.lua',
`-- converted via warframe-data\n
local WeaponData = ${luatable};

return WeaponData;
`)
});
