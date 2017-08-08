const r = require('rethinkdb');
const fs = require('fs-extra');
const request = require('request-promise-native');
const parseObjects = require('./parsing/parse-objects').default;
const parseData = require('./parsing/parse-data').default;
const fetchCategory = require('./fetching/fetch-category').default;

/*
Scrubbing:

`/Wiki/{mod_name|companion_name|weapon_name}?action=raw`
`/Wiki/{warframe_name}/Main?action=raw`
`/Wiki/{warframe_name}/Prime?action=raw`
`/Wiki/{warframe_name}/Abilities?action=raw`

http://warframe.wikia.com/api/v1/Articles/List?category={category}&limit={limit}

Categories:
- Mods
- Weapons
- Warframes
- Sentinel
- Kubrow
- Kavat
*/

const baseUrl = 'https://warframe.wikia.com/Wiki/';
const apiUrl = 'https://warframe.wikia.com/api/v1/';
function makeRawUrl(name, sub) {
  return baseUrl + name + (sub ? sub : '') + '?action=raw';
}

const limit = 50;

const categories = [
  // 'Warframes', // (/Main) - {{Warframe}}
  'Weapons', // {{WeaponInfoboxU11}}
  // 'Mods', // {{ModBox}} | emodtable
  // 'Sentinel', // {{Sentinel}}
  // 'Kubrow', // {{Kubrow}}
  // 'Kavat' // {{Kavat}}
];

fs.emptyDir('./scrubbed').then(() => Promise.all([
  fs.ensureDir('./scrubbed/category'),
  fs.ensureDir('./scrubbed/data').then(() => Promise.all([
    fs.ensureDir('./scrubbed/data/mods'),
    fs.ensureDir('./scrubbed/data/weapons'),
  ])),
])).then(async () => {
  for(const category of categories) {

    const results = await fetchCategory(category, limit);
    fs.writeJsonSync(`./scrubbed/category/${category}.json`, results, { spaces: 2 })

    for(const result of results) {

      console.log('Fetching ' + result.title + '...');

      /** @type {string} */
      const body = await request(`https://warframe.wikia.com${result.url}?action=raw`);
      const objects = parseObjects(body);
      const data = parseData(objects);
      const main = data[0] || { name: result.title };

      const catMatch = body.match(/\[\[Category:(.+?)\]\]/gm);
      let cats = [];
      if(catMatch) {
        const execs = catMatch.map(a => /\[\[Category:(.+?)\]\]/gm.exec(a));
        cats = execs.filter(a => a && a.length > 1).map(a => a[1]);
      }

      const id = main.name.replace(/[^\w-_]/, '_').replace(/(^_+)|(_+$)/g, '').toLocaleLowerCase();

      main.wiki_link = result.url;
      main.categories = cats;

      if(data.length > 1)
        main.extra = data.slice(1);

      fs.writeJsonSync(`scrubbed/data/weapons/${id}.json`, main, { spaces: 2 });
      // console.log(JSON.stringify(page, null, 2));
    }
  }
}).catch(e => {
  console.error(e);
})
// fs.mkdirSync('./scrubbed/category');
