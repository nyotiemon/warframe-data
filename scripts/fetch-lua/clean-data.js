const fs = require('fs-extra');

const rootDir = './fetch-lua-data';

module.exports.default = function cleanData(data) {

  return fs.emptyDir(rootDir).then(() => Promise.all([
    fs.ensureDir(rootDir + '/Weapons'),
    fs.ensureDir(rootDir + '/Stances'),
    fs.ensureDir(rootDir + '/Augments')
  ])).then(() => {
    for(const key in data) {
      if(data[key] instanceof Array) for(const item of data[key]) {
        if(typeof item.Name === 'undefined') { continue; } else {
          const id = item.Name.replace(/[^\w_-]+/g, '_').replace(/(^_+)|(_+$)/g, '').toLocaleLowerCase();
          fs.writeJsonSync(`${rootDir}/${key}/${id}.json`, item, { spaces: 2 });
        }
      } else for(const itemKey in data[key]) {
        const item = data[key][itemKey];
        if(typeof item.Name === 'undefined') { continue; } else {
          const id = item.Name.replace(/[^\w_-]+/g, '_').replace(/(^_+)|(_+$)/g, '').toLocaleLowerCase();
          fs.writeJsonSync(`${rootDir}/${key}/${id}.json`, item, { spaces: 2 });
      }
    }
    }
  });
}
