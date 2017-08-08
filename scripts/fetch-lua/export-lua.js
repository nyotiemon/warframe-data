const fs = require('fs-extra');
const toLua = require('./jslib/js-lua').toLua;

const outDir = './export-lua';
const rootDir = './fetch-lua-data';

const useKeysDirs = [
  /^Weapons$/
];

if(!fs.existsSync(rootDir)) return;

const bigObj = {};

const dir = fs.readdirSync(rootDir);
for(const file of dir) {

  const stat = fs.lstatSync(rootDir + '/' + file);
  const useKeys = useKeysDirs.findIndex(a => a.test(file)) >= 0;

  bigObj[file] = useKeys ? {} : [];

  if(stat.isDirectory()) {
    const subdir = fs.readdirSync(rootDir + '/' + file);

    for(const subfile of subdir) {
      if(!/\.json$/.test(subfile)) continue;

      const json = fs.readJsonSync(rootDir + '/' + file + '/' + subfile);
      if(useKeys) {
        bigObj[file][json.Name] = json;
      } else {
        bigObj[file].push(json);
      }
    }
  }
}

const luaTable = toLua(bigObj, 5);
fs.ensureDir(outDir).then(() => {
  fs.writeFileSync(outDir + '/weapon-data.lua',
`-- converted via warframe-data\n
local WeaponData = ${luaTable};

return WeaponData;
`);
});
