const parseWeapon = require('./parse-weapon').default;
const parseMod = require('./parse-mod').default;

const parseMap = {
  'WeaponInfoboxU11': parseWeapon,
  'ModBox': parseMod
}

/**
 * @param {any[]} objects
 * @returns {any[]}
 */
module.exports.default = function parseData(objects) {
  if(!objects) return null;
  return objects.map(o => {
    if(parseMap[o.name]) return parseMap[o.name](o.vars);
    else return null;
  }).filter(a => a != null);
}
