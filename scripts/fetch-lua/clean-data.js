/*jshint esversion: 6 */
const fs = require('fs-extra');

const rootDir = './fetch-lua-data';

module.exports.default = function cleanData(data) {

  return fs.emptyDir(rootDir).then(() => Promise.all([
    fs.ensureDir(rootDir + '/Weapons'),
    fs.ensureDir(rootDir + '/Stances'),
    fs.ensureDir(rootDir + '/Augments')
  ])).then(() => {
    var oui = 0;
    // all data(key, value). value with typeOf array is printed as Object (ex: Cost, NormalAttack)

    for(const key in data) {
      // here got the key : IgnoreInCount / Weapons / Stances / Augments

      if(data[key] instanceof Array) for(const item of data[key]) { // if inside data doesnt have an array (object)
        // console.log("[" + oui++ + "] : ", item);

        if(typeof item.Name === 'undefined') { continue; } else {
          const id = item.Name.replace(/[^\w_-]+/g, '_').replace(/(^_+)|(_+$)/g, '').toLocaleLowerCase();
          fs.writeJsonSync(`${rootDir}/${key}/${id}.json`, item, { spaces: 2 });
        }
      } else for(const itemKey in data[key]) { // if inside of data have an array
        const item = data[key][itemKey];
        // console.log("[" + oui++ + "]- Name : ", item.Name + ", Type : ", item.Type + ", Class : ", item.Class + ", Disposition : ", item.Disposition + ", Image : ", item.Image);

        if(typeof item.Name === 'undefined') { continue; } else {
          const id = item.Name.replace(/[^\w_-]+/g, '_').replace(/(^_+)|(_+$)/g, '').toLocaleLowerCase();
          fs.writeJsonSync(`${rootDir}/${key}/${id}.json`, item, { spaces: 2 });
        }
      }
    }
  });
};
