const fs = require('fs-extra');

module.exports.default = function cleanData() {
  const data = fs.readJsonSync('./wikia-data/weapon-data.json');

  return fs.emptyDir('./wikia-data-json').then(() => Promise.all([
    fs.ensureDir('./wikia-data-json/Weapons'),
    fs.ensureDir('./wikia-data-json/Stances'),
    fs.ensureDir('./wikia-data-json/Augments')
  ])).then(() => {
    for(const key in data) {
      if(data[key] instanceof Array) for(const item of data[key]) {
        const id = item.Name.replace(/[^\w_-]+/g, '_').replace(/(^_+)|(_+$)/g, '').toLocaleLowerCase();
        fs.writeJsonSync(`./wikia-data-json/${key}/${id}.json`, item, { spaces: 2 });
      } else for(const itemKey in data[key]) {
        const item = data[key][itemKey];
        const id = item.Name.replace(/[^\w_-]+/g, '_').replace(/(^_+)|(_+$)/g, '').toLocaleLowerCase();
        fs.writeJsonSync(`./wikia-data-json/${key}/${id}.json`, item, { spaces: 2 });
      }
    }
  });
}
