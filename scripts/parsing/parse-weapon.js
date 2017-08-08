const util = require('./util');

const fields = [
  'name',                            // (both)
  'image',                           // (both)
  'mastery level',                   // (both)
  'slot',                            // (both)
  'type',                            // (both)

  'trigger',                         // (projectile)
  'noise level',                     // (projectile)
  'rate of fire',                    // (projectile)
  'accuracy',                        // (projectile)
  'zoom',                            // (projectile)
  'spread',                          // (projectile)
  'recoil',                          // (projectile)
  'clip',                            // (projectile)
  'max ammo',                        // (projectile)
  'reload',                          // (projectile)
  'projectile speed',                // (both)
  'disposition',                     // (both)
  'stat proc',                       // (both)

  'attack rate',                     // (melee)

  'physical damage',                 // (both) ({null}|charge) (aoe|secondary) (jump|slam|slide)
  'impact damage',                   // (both) ({null}|charge) (aoe|secondary) (jump|slam|slide)
  'puncture damage',                 // (both) ({null}|charge) (aoe|secondary) (jump|slam|slide)
  'slash damage',                    // (both) ({null}|charge) (aoe|secondary) (jump|slam|slide)
  'elemental damage type',           // (both) ({null}|charge) (aoe|secondary) (jump|slam|slide)
  'elemental damage',                // (both) ({null}|charge) (aoe|secondary) (jump|slam|slide)
  'crit chance',                     // (both) ({null}|charge) (aoe|secondary) (jump|slide)
  'crit damage',                     // (both) ({null}|charge) (aoe|secondary) (jump|slide)
  'punch through',                   // (projectile)
  'pellets',                         // (projectile:shotgun)

  'charge physical damage',          // (both)
  'charge impact damage',            // (both)
  'charge puncture damage',          // (both)
  'charge slash damage',             // (both)
  'charge elemental damage type',    // (both)
  'charge elemental damage',         // (both)
  'charge speed',                    // (both)
  'charge cleave',                   // (melee) // reach
  'charge crit chance',              // (both)
  'charge crit damage',              // (both)
  'charge stat proc',                // (both)

  'slam physical damage',            // (melee)
  'slam impact damage',              // (melee)
  'slam puncture damage',            // (melee)
  'slam slash damage',               // (melee)
  'slam elemental damage type',      // (melee)
  'slam elemental damage',           // (melee)
  'slam radius',                     // (melee)

  'slide physical damage',           // (melee)
  'slide impact damage',             // (melee)
  'slide puncture damage',           // (melee)
  'slide slash damage',              // (melee)
  'slide elemental damage type',     // (melee)
  'slide elemental damage',          // (melee)
  'slide crit chance',               // (melee)
  'slide crit damage',               // (melee)

  'aoe physical damage',             // (projectile)
  'aoe impact damage',               // (projectile)
  'aoe puncture damage',             // (projectile)
  'aoe slash damage',                // (projectile)
  'aoe elemental damage type',       // (projectile)
  'aoe elemental damage',            // (projectile)
  'aoe number of ticks',             // (projectile)
  'aoe speed',                       // (projectile)

  'secondary physical damage',       // (projectile)
  'secondary impact damage',         // (projectile)
  'secondary puncture damage',       // (projectile)
  'secondary slash damage',          // (projectile)
  'secondary elemental damage type', // (projectile)
  'secondary elemental damage',      // (projectile)

  'finisher damage',                 // (melee)
  'max targets',                     // (melee)
  'cleave radius',                   // (melee)

  'conclave',                        // (both)
  'polarities',                      // (both)
];

const strings = [
  /^name$/,
  /^image$/,
  /^mastery level$/,
  /^slot$/,
  /^type$/,

  /^trigger$/,
  /^noise level$/,
  /^stat proc$/,

  /damage type$/,

  /^polarities$/,
];

const categories = [
  'charge',
  'slam',
  'slide',
  'aoe',
  'secondary'
];

const categoriesRegExp = categories.map(a => new RegExp(`^${a}`));

/**
 * @param {string} k
 * @return {string}
 */
function cleanKey(k) {
 return k.replace(/[^\w-_]/g, '_').replace(/(^_+)|(_+$)/g, '');
}

/**
 * @param {string[]} data
 * @return {any}
 */
module.exports.default = function parseWeapon(vars) {
  const data = util.splitVars(vars);
  const ret = { };
  for(const key of fields) {
    if(!data[key]) continue;
    let cat = categoriesRegExp.findIndex(a => a.test(key));
    if(cat >= 0) {
      cat = categories[cat];
      ret[cat] = ret[cat] || {};
      ret[cat][cleanKey(key.replace(cat, ''))] = data[key];
    } else {
      ret[cleanKey(key)] = data[key];
    }
  }
  return ret;
}
